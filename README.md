# seismic-pulse
Seismic Pulse — Setup Guide

Digest mingguan komunitas buat Seismic. Website statis (HTML/CSS/JS biasa, ga perlu server) + workflow n8n yang jalan tiap minggu buat ngisi datanya.

Proyek ini bukan situs resmi Seismic — ini proyek komunitas independen.

Struktur folder

seismic-pulse/

index.html → halaman utama

style.css  → semua styling

script.js → baca data/digest.json, render ke halaman

data/

   > digest.json → data mingguan (ditulis otomatis oleh n8n)
   
   > n8n-workflow.json → workflow n8n yang bisa langsung di-import
