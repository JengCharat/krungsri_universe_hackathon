
<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/all_chat.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
        window.chatGroupId = @json($chatGroupId);
    </script>
    <div id="all_chat"></div>
</body>
</html>
