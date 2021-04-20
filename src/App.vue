<template>
  <div id="app">
    <div id="me"></div>
    <div id="remote"></div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk"
// 入参
// channel: agroa
// appID:67f2ffd0bb514cc68b5cbc0cf4c4607d
// token:00667f2ffd0bb514cc68b5cbc0cf4c4607dIADRy7I22m/qbW7TIR8qCTsgTuDfQ7lSu/vty6LCvrLwHML8JEsAAAAAEAA9Jcjim9d/YAEAAQCa139g
const APPID = '67f2ffd0bb514cc68b5cbc0cf4c4607d';
const TOKEN = '00667f2ffd0bb514cc68b5cbc0cf4c4607dIAA0XVUBRsOvuJyH7/58UVk/zl7opDFykPGb5beSRQETmP2gtqAAAAAAEAA9Jcjix/1/YAEAAQDG/X9g';
// todo 销毁,sdk各种参数与指标
import utils from './common/util';
export default {
  name: 'app',
  created() {
    this.initClient();
  },
  mounted() {
    this.joinChannel('agora').then(uid => {
      this.$nextTick(() => {
        this.initLocalStream();
        this.streamSubcribe();
      });
    })
  },
  data () {
    return {
      localStream: null,
      client: null,
      uid: 393939,
    }
  },
  methods: {
    initClient(mode = 'rtc', codec = 'vp8') {
      this.client = AgoraRTC.createClient({
        mode: mode,
        codec: codec,
      });
      this.client.init(APPID, () => {
        console.log('client init')
      }, (err) => {
        console.log('client init failed', err);
      });
    },
    joinChannel(channelName) {
      return new Promise(resolve => {
        this.client.join(TOKEN, channelName, ~~(Math.random()*400000),
          uid => {
            console.log('加入频道成功', uid);
            resolve(uid);
          },
          err => {
            console.log('加入频道失败', err);
          });
      });
    },
    // 本地流初始化/播放/推送
    initLocalStream() {
      this.localStream = AgoraRTC.createStream({
        audio: true,
        video: true,
      });
      this.localStream.init(() => {
        this.localStream.play('me');
        this.client.publish(this.localStream, utils.handleError);
      }, utils.handleError);
    },
    // 订阅播放
    streamSubcribe() {
      // 有远端用户发布流时进行订阅
      this.client.on('stream-added', evt => {
        console.log('clientclientclient', this.client);
        this.client.subscribe(evt.stream, utils.handleError);
      });
      // 订阅成功后播放远端用户的流
      this.client.on('stream-subscribed', function(evt){
        let stream = evt.stream;
        let streamId = String(stream.getId());
        console.log('流ID', streamId);
        utils.addVideoStream(streamId);
        stream.play(streamId);
      });
    }
  },
}
</script>

<style lang="scss">
#me {
  width: 500px;
  height: 500px;
}
#remote {
  width: 500px;
  height: 500px;
}
#remote div {
  width: 500px;
  height: 500px;
}
</style>
