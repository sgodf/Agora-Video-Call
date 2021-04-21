<template>
  <div id="app">
    <div class="top_bar">
      <img 
        height="30px" 
        src="./assets/logo.png"
        class="align-middle logo-img">
    </div>
    <div v-if="!inChannel" class="info_img">
      <div>Agora SDK Test</div>
      <img height="260px" src="./assets/place.png">
    </div>
    <div v-else class="videoContainer">
      <div id="me"></div>
      <div id="remote"></div>
    </div>
    <div class="place">
      <span v-show="inChannel">加入频道成功！</span>
    </div>
    <div style="display: flex">
      <button  v-if="!inChannel" class="join_btn" @click="handlerJoinChannel">加入频道</button>
      <button  v-if="inChannel" class="leave_btn" @click="leaveChannel">离开频道</button>
    </div>
  </div>
</template>
<script>
import AgoraRTC from "agora-rtc-sdk"
// 入参
// channel: agroa
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

  },
  data () {
    return {
      localStream: null,
      client: null,
      inChannel: false,
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
    handlerJoinChannel() {
      this.joinChannel('agora').then(uid => {
        this.initLocalStream();
        this.streamSubcribe();
        this.inChannel = true;
      });
    },
    joinChannel(channelName) {
      if (!this.client) {
        this.initClient();
      }
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
    // 订阅播放/取消/退出
    streamSubcribe() {
      // 有远端用户发布流时进行订阅
      this.client.on('stream-added', evt => {
        console.log('clientclientclient', this.client);
        this.client.subscribe(evt.stream, utils.handleError);
      });
      // 订阅成功后播放远端用户的流
      this.client.on('stream-subscribed', evt => {
        let stream = evt.stream;
        let streamId = String(stream.getId());
        console.log('流ID', streamId);
        utils.addVideoStream(streamId);
        stream.play(streamId);
      });
      // 远端用户取消发布流时，关闭及移除对应的流。
      this.client.on("stream-removed", evt => {
        let stream = evt.stream;
        let streamId = String(stream.getId());
        stream.close();
        utils.removeVideoStream(streamId, true);
      });
      // 远端用户离开频道时，关闭及移除对应的流。
      this.client.on("peer-leave", evt => {
        let stream = evt.stream;
        let streamId = String(stream.getId());
        stream.close();
        utils.removeVideoStream(streamId, true);
      });
      this.client.on('connection-state-change', () => {
        console.log('!!!!!!!!!!!!!!');
      });
    },
    leaveChannel() {
      this.client.leave(() => {
        console.log('已离开频道');
        this.inChannel = false;
        if (this.localStream.isPlaying()) {
          this.localStream.stop()
        }
        // Close the local stream
        this.localStream.close();
        this.client = null;
        this.localStream = null;
        utils.removeVideoStream('', false);
      }, utils.handlerError);
    }
  },
}
</script>

<style lang="scss">
body, html {
  color: #666;
}
#me {
  width: 400px;
  height: 400px;
  margin-right: 10px;
}
.remote {
  width: 400px;
  height: 400px;
  margin-right: 10px;
}
#remote div {
  width: 100%;
  height: 100%;
}
.videoContainer {
  display: flex;
  width: 60vw;
  flex: 1;
  margin: 30px auto;
}
.top_bar {
  height: 70px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .15);
}
.logo-img {
  margin-top: 20px;
  margin-left: 20px;
  cursor: pointer;
  vertical-align: middle;
  border-style: none;
}
.info_img {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.info_img div {
  margin-bottom: 20px;
}
.place {
  height: 50px;
  text-align: center;
}
.join_btn, .leave_btn {
  width: 400px;
  height: 34px;
  margin: auto;
  padding: 0;
  border: none;
  border-radius: 2px;
  font-weight: 500;
  display: inline-block;
  line-height: 1;
  text-align: center;
}
.join_btn {
  color: #fff;
  background-color: #099dfd;
}
.leave_btn {
  color: #3ab7f8;
  background-color: #fff;
  border: 1px solid #e9e9e9;
}
</style>
