@echo off
setlocal enabledelayedexpansion

echo ============================================
echo MEMBUAT STRUKTUR FRONTEND JIMPITAN DESA
echo ============================================
echo.

REM Membuat folder utama
mkdir frontend
mkdir frontend\assets
mkdir frontend\assets\css
mkdir frontend\assets\js
mkdir frontend\assets\icons
mkdir frontend\pages
mkdir frontend\pages\user
mkdir frontend\pages\bendahara
mkdir frontend\pages\admin

echo [OK] Folder utama berhasil dibuat
echo.

REM Membuat file di root frontend
echo Membuat file root...
echo ^<!DOCTYPE html^> > frontend\index.html
echo ^<!-- Login Page --^> >> frontend\index.html
echo ^<html^> >> frontend\index.html
echo ^<head^> >> frontend\index.html
echo     ^<meta charset="UTF-8"^> >> frontend\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> frontend\index.html
echo     ^<title^>Jimpitan Desa - Login^</title^> >> frontend\index.html
echo     ^<link rel="stylesheet" href="assets/css/style.css"^> >> frontend\index.html
echo ^</head^> >> frontend\index.html
echo ^<body^> >> frontend\index.html
echo     ^<div class="login-container"^> >> frontend\index.html
echo         ^<h1^>JIMPITAN DESA^</h1^> >> frontend\index.html
echo         ^<form id="loginForm"^> >> frontend\index.html
echo             ^<input type="text" id="username" placeholder="Username" required^> >> frontend\index.html
echo             ^<input type="password" id="password" placeholder="Password" required^> >> frontend\index.html
echo             ^<button type="submit"^>LOGIN^</button^> >> frontend\index.html
echo         ^</form^> >> frontend\index.html
echo         ^<p id="error" style="color:red;"^>^</p^> >> frontend\index.html
echo     ^</div^> >> frontend\index.html
echo     ^<script src="assets/js/api.js"^>^</script^> >> frontend\index.html
echo     ^<script src="assets/js/auth.js"^>^</script^> >> frontend\index.html
echo ^</body^> >> frontend\index.html
echo ^</html^> >> frontend\index.html
echo [OK] index.html

echo {} > frontend\manifest.json
echo [OK] manifest.json

echo // Service Worker > frontend\service-worker.js
echo [OK] service-worker.js

REM Membuat file CSS
echo /* Style utama */ > frontend\assets\css\style.css
echo [OK] assets\css\style.css

REM Membuat file JavaScript
echo // API Configuration > frontend\assets\js\api.js
echo // Authentication > frontend\assets\js\auth.js
echo // Local Storage / IndexedDB > frontend\assets\js\storage.js
echo // Main App > frontend\assets\js\app.js
echo [OK] assets\js\*.js

REM Membuat file icons (placeholder)
echo Icon 192x192 > frontend\assets\icons\icon-192x192.png
echo Icon 512x512 > frontend\assets\icons\icon-512x512.png
echo [OK] assets\icons\*.png

REM Membuat file halaman USER
echo ^<!DOCTYPE html^> > frontend\pages\user\dashboard.html
echo ^<html^> >> frontend\pages\user\dashboard.html
echo ^<head^> >> frontend\pages\user\dashboard.html
echo     ^<title^>Dashboard User^</title^> >> frontend\pages\user\dashboard.html
echo ^</head^> >> frontend\pages\user\dashboard.html
echo ^<body^> >> frontend\pages\user\dashboard.html
echo     ^<h1^>Dashboard User^</h1^> >> frontend\pages\user\dashboard.html
echo ^</body^> >> frontend\pages\user\dashboard.html
echo ^</html^> >> frontend\pages\user\dashboard.html
echo [OK] pages\user\dashboard.html

echo ^<!DOCTYPE html^> > frontend\pages\user\catat-jimpitan.html
echo ^<html^> >> frontend\pages\user\catat-jimpitan.html
echo ^<head^> >> frontend\pages\user\catat-jimpitan.html
echo     ^<title^>Catat Jimpitan^</title^> >> frontend\pages\user\catat-jimpitan.html
echo ^</head^> >> frontend\pages\user\catat-jimpitan.html
echo ^<body^> >> frontend\pages\user\catat-jimpitan.html
echo     ^<h1^>Catat Jimpitan^</h1^> >> frontend\pages\user\catat-jimpitan.html
echo ^</body^> >> frontend\pages\user\catat-jimpitan.html
echo ^</html^> >> frontend\pages\user\catat-jimpitan.html
echo [OK] pages\user\catat-jimpitan.html

echo ^<!DOCTYPE html^> > frontend\pages\user\akun.html
echo ^<html^> >> frontend\pages\user\akun.html
echo ^<head^> >> frontend\pages\user\akun.html
echo     ^<title^>Akun User^</title^> >> frontend\pages\user\akun.html
echo ^</head^> >> frontend\pages\user\akun.html
echo ^<body^> >> frontend\pages\user\akun.html
echo     ^<h1^>Akun User^</h1^> >> frontend\pages\user\akun.html
echo ^</body^> >> frontend\pages\user\akun.html
echo ^</html^> >> frontend\pages\user\akun.html
echo [OK] pages\user\akun.html

REM Membuat file halaman BENDAHARA
echo ^<!DOCTYPE html^> > frontend\pages\bendahara\dashboard.html
echo ^<html^> >> frontend\pages\bendahara\dashboard.html
echo ^<head^> >> frontend\pages\bendahara\dashboard.html
echo     ^<title^>Dashboard Bendahara^</title^> >> frontend\pages\bendahara\dashboard.html
echo ^</head^> >> frontend\pages\bendahara\dashboard.html
echo ^<body^> >> frontend\pages\bendahara\dashboard.html
echo     ^<h1^>Dashboard Bendahara^</h1^> >> frontend\pages\bendahara\dashboard.html
echo ^</body^> >> frontend\pages\bendahara\dashboard.html
echo ^</html^> >> frontend\pages\bendahara\dashboard.html
echo [OK] pages\bendahara\dashboard.html

echo ^<!DOCTYPE html^> > frontend\pages\bendahara\tarik-kas.html
echo ^<html^> >> frontend\pages\bendahara\tarik-kas.html
echo ^<head^> >> frontend\pages\bendahara\tarik-kas.html
echo     ^<title^>Tarik Kas^</title^> >> frontend\pages\bendahara\tarik-kas.html
echo ^</head^> >> frontend\pages\bendahara\tarik-kas.html
echo ^<body^> >> frontend\pages\bendahara\tarik-kas.html
echo     ^<h1^>Tarik Kas^</h1^> >> frontend\pages\bendahara\tarik-kas.html
echo ^</body^> >> frontend\pages\bendahara\tarik-kas.html
echo ^</html^> >> frontend\pages\bendahara\tarik-kas.html
echo [OK] pages\bendahara\tarik-kas.html

echo ^<!DOCTYPE html^> > frontend\pages\bendahara\laporan.html
echo ^<html^> >> frontend\pages\bendahara\laporan.html
echo ^<head^> >> frontend\pages\bendahara\laporan.html
echo     ^<title^>Laporan^</title^> >> frontend\pages\bendahara\laporan.html
echo ^</head^> >> frontend\pages\bendahara\laporan.html
echo ^<body^> >> frontend\pages\bendahara\laporan.html
echo     ^<h1^>Laporan^</h1^> >> frontend\pages\bendahara\laporan.html
echo ^</body^> >> frontend\pages\bendahara\laporan.html
echo ^</html^> >> frontend\pages\bendahara\laporan.html
echo [OK] pages\bendahara\laporan.html

echo ^<!DOCTYPE html^> > frontend\pages\bendahara\akun.html
echo ^<html^> >> frontend\pages\bendahara\akun.html
echo ^<head^> >> frontend\pages\bendahara\akun.html
echo     ^<title^>Akun Bendahara^</title^> >> frontend\pages\bendahara\akun.html
echo ^</head^> >> frontend\pages\bendahara\akun.html
echo ^<body^> >> frontend\pages\bendahara\akun.html
echo     ^<h1^>Akun Bendahara^</h1^> >> frontend\pages\bendahara\akun.html
echo ^</body^> >> frontend\pages\bendahara\akun.html
echo ^</html^> >> frontend\pages\bendahara\akun.html
echo [OK] pages\bendahara\akun.html

REM Membuat file halaman ADMIN
echo ^<!DOCTYPE html^> > frontend\pages\admin\dashboard.html
echo ^<html^> >> frontend\pages\admin\dashboard.html
echo ^<head^> >> frontend\pages\admin\dashboard.html
echo     ^<title^>Dashboard Admin^</title^> >> frontend\pages\admin\dashboard.html
echo ^</head^> >> frontend\pages\admin\dashboard.html
echo ^<body^> >> frontend\pages\admin\dashboard.html
echo     ^<h1^>Dashboard Admin^</h1^> >> frontend\pages\admin\dashboard.html
echo ^</body^> >> frontend\pages\admin\dashboard.html
echo ^</html^> >> frontend\pages\admin\dashboard.html
echo [OK] pages\admin\dashboard.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\warga.html
echo ^<html^> >> frontend\pages\admin\warga.html
echo ^<head^> >> frontend\pages\admin\warga.html
echo     ^<title^>Data Warga^</title^> >> frontend\pages\admin\warga.html
echo ^</head^> >> frontend\pages\admin\warga.html
echo ^<body^> >> frontend\pages\admin\warga.html
echo     ^<h1^>Data Warga^</h1^> >> frontend\pages\admin\warga.html
echo ^</body^> >> frontend\pages\admin\warga.html
echo ^</html^> >> frontend\pages\admin\warga.html
echo [OK] pages\admin\warga.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\jadwal.html
echo ^<html^> >> frontend\pages\admin\jadwal.html
echo ^<head^> >> frontend\pages\admin\jadwal.html
echo     ^<title^>Jadwal^</title^> >> frontend\pages\admin\jadwal.html
echo ^</head^> >> frontend\pages\admin\jadwal.html
echo ^<body^> >> frontend\pages\admin\jadwal.html
echo     ^<h1^>Jadwal^</h1^> >> frontend\pages\admin\jadwal.html
echo ^</body^> >> frontend\pages\admin\jadwal.html
echo ^</html^> >> frontend\pages\admin\jadwal.html
echo [OK] pages\admin\jadwal.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\tarif.html
echo ^<html^> >> frontend\pages\admin\tarif.html
echo ^<head^> >> frontend\pages\admin\tarif.html
echo     ^<title^>Tarif^</title^> >> frontend\pages\admin\tarif.html
echo ^</head^> >> frontend\pages\admin\tarif.html
echo ^<body^> >> frontend\pages\admin\tarif.html
echo     ^<h1^>Tarif^</h1^> >> frontend\pages\admin\tarif.html
echo ^</body^> >> frontend\pages\admin\tarif.html
echo ^</html^> >> frontend\pages\admin\tarif.html
echo [OK] pages\admin\tarif.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\monitoring.html
echo ^<html^> >> frontend\pages\admin\monitoring.html
echo ^<head^> >> frontend\pages\admin\monitoring.html
echo     ^<title^>Monitoring^</title^> >> frontend\pages\admin\monitoring.html
echo ^</head^> >> frontend\pages\admin\monitoring.html
echo ^<body^> >> frontend\pages\admin\monitoring.html
echo     ^<h1^>Monitoring^</h1^> >> frontend\pages\admin\monitoring.html
echo ^</body^> >> frontend\pages\admin\monitoring.html
echo ^</html^> >> frontend\pages\admin\monitoring.html
echo [OK] pages\admin\monitoring.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\audit-log.html
echo ^<html^> >> frontend\pages\admin\audit-log.html
echo ^<head^> >> frontend\pages\admin\audit-log.html
echo     ^<title^>Audit Log^</title^> >> frontend\pages\admin\audit-log.html
echo ^</head^> >> frontend\pages\admin\audit-log.html
echo ^<body^> >> frontend\pages\admin\audit-log.html
echo     ^<h1^>Audit Log^</h1^> >> frontend\pages\admin\audit-log.html
echo ^</body^> >> frontend\pages\admin\audit-log.html
echo ^</html^> >> frontend\pages\admin\audit-log.html
echo [OK] pages\admin\audit-log.html

echo ^<!DOCTYPE html^> > frontend\pages\admin\akun.html
echo ^<html^> >> frontend\pages\admin\akun.html
echo ^<head^> >> frontend\pages\admin\akun.html
echo     ^<title^>Akun Admin^</title^> >> frontend\pages\admin\akun.html
echo ^</head^> >> frontend\pages\admin\akun.html
echo ^<body^> >> frontend\pages\admin\akun.html
echo     ^<h1^>Akun Admin^</h1^> >> frontend\pages\admin\akun.html
echo ^</body^> >> frontend\pages\admin\akun.html
echo ^</html^> >> frontend\pages\admin\akun.html
echo [OK] pages\admin\akun.html

echo.
echo ============================================
echo STRUKTUR FRONTEND BERHASIL DIBUAT
echo ============================================
echo.
echo Struktur folder:
echo frontend\
echo ├── index.html
echo ├── manifest.json
echo ├── service-worker.js
echo ├── assets\
echo │   ├── css\
echo │   │   └── style.css
echo │   ├── js\
echo │   │   ├── api.js
echo │   │   ├── auth.js
echo │   │   ├── storage.js
echo │   │   └── app.js
echo │   └── icons\
echo │       ├── icon-192x192.png
echo │       └── icon-512x512.png
echo └── pages\
echo     ├── user\
echo     │   ├── dashboard.html
echo     │   ├── catat-jimpitan.html
echo     │   └── akun.html
echo     ├── bendahara\
echo     │   ├── dashboard.html
echo     │   ├── tarik-kas.html
echo     │   ├── laporan.html
echo     │   └── akun.html
echo     └── admin\
echo         ├── dashboard.html
echo         ├── warga.html
echo         ├── jadwal.html
echo         ├── tarif.html
echo         ├── monitoring.html
echo         ├── audit-log.html
echo         └── akun.html
echo.
pause