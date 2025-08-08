<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
    @vite(['resources/js/app.jsx'])
</head>
<body>
    <script>
        window.userToken = @json($token);
        window.chatGroupId = @json($chatGroupId);
    </script>
    <div id="app"></div>
</body>
</html>
