\# Final Project QA - OrangeHRM Test Automation



Automation testing untuk fitur \*\*Login\*\*, \*\*Directory\*\*, dan \*\*Recruitment\*\* pada OrangeHRM Demo (`https://opensource-demo.orangehrmlive.com`) menggunakan Cypress dengan format \*\*Page Object Model (POM)\*\* dan \*\*cy.intercept()\*\*.



\## Struktur Project
Final Project QA/

├── cypress/

│   ├── e2e/

│   │   ├── login.cy.js

│   │   ├── directory.cy.js

│   │   └── recruitment.cy.js

│   ├── fixtures/

│   │   └── loginData.json

│   └── support/

│       ├── pages/

│       │   ├── LoginPage.js

│       │   ├── DirectoryPage.js

│       │   └── RecruitmentPage.js

│       ├── commands.js

│       └── e2e.js

├── cypress.config.js

├── package.json

└── README.md



\## Total Test Case: 24 (8 per fitur)



\### Fitur Login (8 test case)

Login valid, username tidak terdaftar, password salah, field kosong (3 skenario), input 100+ karakter, navigasi Forgot Password — semua dengan intercept `POST \*\*/auth/validate`.



\### Fitur Directory (8 test case)

Search by nama (valid \& invalid autocomplete), filter Job Title, filter Location, kombinasi filter, Reset, halaman awal, klik detail karyawan — dengan intercept `GET \*\*/api/v2/directory/employees\*\*`.



\### Fitur Recruitment (8 test case)

Filter Status, search candidate (valid \& invalid autocomplete), filter Job Title, Reset, halaman awal, tombol Add, lihat detail kandidat — dengan intercept `GET \*\*/api/v2/recruitment/candidates\*\*`.



\## Cara Menjalankan

```bash

npm install

npx cypress run

```



Jalankan per fitur:

```bash

npx cypress run --spec "cypress/e2e/login.cy.js"

npx cypress run --spec "cypress/e2e/directory.cy.js"

npx cypress run --spec "cypress/e2e/recruitment.cy.js"

```



\## Kredensial Demo

`Admin` / `admin123`



\## Catatan

\- Semua test menggunakan Page Object Model — locator \& aksi dipisah dari logika test di file `cypress/support/pages/`.

\- Setiap skenario memakai `cy.intercept()` yang berbeda-beda (endpoint atau validasi berbeda) 

\- Situs demo publik OrangeHRM kadang mengalami gangguan koneksi sesaat (server timeout) karena dipakai bersama oleh banyak pengguna untuk latihan — bila terjadi, jalankan ulang perintah test.

