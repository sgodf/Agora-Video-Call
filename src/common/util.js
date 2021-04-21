const handlerError = function(err) {
    console.log('error', err);
}
const addVideoStream = function(elementId) {
    // 给每个流创建一个 div
    let streamDiv = document.createElement('div');
    // 将 elementId 分配到 div
    streamDiv.id = elementId;
    // 处理镜像问题
    streamDiv.style.transform = 'rotateY(180deg)';
    streamDiv.className = 'remote';
    let remoteContainer = document.getElementsByClassName('videoContainer')[0];
    // 将 div 添加到容器
    remoteContainer.appendChild(streamDiv);
}
const removeVideoStream = function(elementId, isRemote) {
    if (isRemote) {
      let remoteDiv = document.getElementById(elementId);
      if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
    } else {
      let parentDiv = document.getElementById('me');
      if (parentDiv.firstChild) parentDiv.removeChild(parentDiv.firstChild);
    }
}
export default {
    handlerError,
    addVideoStream,
    removeVideoStream,
}