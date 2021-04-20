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
    let remoteContainer = document.getElementById('remote');
    // 将 div 添加到容器
    remoteContainer.appendChild(streamDiv);
}
const removeVideoStream = function(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
}
export default {
    handlerError,
    addVideoStream,
    removeVideoStream,
}