<!DOCTYPE html>
<html>
<head>
    <title>Laravel + React</title>
@vite(['resources/js/upload_place.jsx']) </head>
<body>
<script>
            window.user = @json(Auth::user());
        </script>
    <div id="upload_place"></div>
</body>
</html>
