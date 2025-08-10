
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/chat_page.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
        window.chatGroupId = @json($chatGroupId);
    </script>
    <div id="chat_page"></div>
</body>
</html>
