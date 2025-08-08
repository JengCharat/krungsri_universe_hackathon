

<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
@vite(['resources/js/app.jsx']) //this will change if it's not a app.blade.php
</head>
<body>

<script>
    window.userToken = "{{ $token }}";
    window.chatGroupId = 1;
</script>
    <div id="app"></div>
</body>
</html>
