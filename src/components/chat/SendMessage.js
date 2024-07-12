
const sendMessage = (roomid, userid, stompClientRef) => {
    var date = new Date();
    var timezoneOffset = date.getTimezoneOffset() * 60000;
    var seoulOffset = (9 * 3600000);
    var seoulTime = new Date(date.getTime() + timezoneOffset + seoulOffset);
    var content = document.getElementById('message').value;
    var message = {
        'type': 'MESSAGE',
        'content': content,
        'sender': userid,
        'partid': userid,
        'sendDate': seoulTime.toISOString()
    };
    stompClientRef.current.send(`/send/chat/message/` + roomid +'/'+ 1, {}, JSON.stringify(message));

   
};
export default sendMessage;
