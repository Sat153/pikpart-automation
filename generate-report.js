const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateReport() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Test Report');

  // ---- Page setup: landscape, fit everything on ONE page ----
  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9, // A4
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    margins: {
      left: 0.3, right: 0.3,
      top: 0.4, bottom: 0.4,
      header: 0.2, footer: 0.2,
    },
  };

  // Narrower columns so everything fits side by side on one page
  sheet.columns = [
    { header: 'Test ID', key: 'id', width: 8 },
    { header: 'Scenario', key: 'scenario', width: 12 },
    { header: 'Test Case', key: 'testcase', width: 24 },
    { header: 'Expected Output', key: 'expected', width: 24 },
    { header: 'Status', key: 'status', width: 8 },
    { header: 'Screenshot', key: 'screenshot', width: 18 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F4E78' },
  };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  sheet.getRow(1).height = 20;

  const testCases = [
    {
      id: 'TC-01',
      scenario: 'Product Search',
      testcase: 'Search for a product using search bar',
      expected: 'Matching product results are displayed',
      status: 'Fail',
      screenshot: 'screenshots/TC01-search-fail.png',
    },
    {
      id: 'TC-02',
      scenario: 'Login',
      testcase: "Login/Register button opens login modal",
      expected: "'Login as' modal with phone field is displayed",
      status: 'Pass',
      screenshot: 'screenshots/TC02-login-modal.png',
    },
    {
      id: 'TC-03',
      scenario: 'Login',
      testcase: 'OTP screen appears after requesting OTP',
      expected: "'Enter OTP' screen with Verify & Login button shown",
      status: 'Pass',
      screenshot: 'screenshots/TC03-otp screen.png',
    },
    {
      id: 'TC-04',
      scenario: 'Login',
      testcase: 'User can complete login using real OTP',
      expected: "'Login/Register' replaced by account name",
      status: 'Pass',
      screenshot: 'screenshots/TC04-logged-in-success.png',
    },
    {
      id: 'TC-05',
      scenario: 'Cart',
      testcase: 'Logged-in user can add a product to cart',
      expected: 'ADD TO CART replaced by quantity stepper',
      status: 'Pass',
      screenshot: 'screenshots/TC05-Add a product to cart.png',
    },
    {
      id: 'TC-06',
      scenario: 'Checkout',
      testcase: 'User can select delivery address',
      expected: "Selected address reflected as 'Deliver to'",
      status: 'Pass',
      screenshot: 'screenshots/TC06-Select Address.png',
    },
    {
      id: 'TC-07',
      scenario: 'Checkout',
      testcase: 'User can click CHECKOUT toward payment',
      expected: 'App proceeds to next checkout/payment step',
      status: 'Pass',
      screenshot: 'screenshots/TC07-Checkout.png',
    },
    {
      id: 'TC-08',
      scenario: 'Pay Now',
      testcase: 'User can see pay now button and proceed to payment',
      expected: 'See pay now button',
      status: 'Pass',
      screenshot: 'screenshots/TC08-Pay Now.png',
    },
  ];

  let rowIndex = 2;

  for (const tc of testCases) {
    const row = sheet.addRow({
      id: tc.id,
      scenario: tc.scenario,
      testcase: tc.testcase,
      expected: tc.expected,
      status: tc.status,
    });

    row.alignment = { vertical: 'middle', wrapText: true };
    row.font = { size: 9 };
    row.height = 55; // smaller row height so more fits on one page

    const statusCell = row.getCell('status');
    statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
    if (tc.status === 'Pass') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
      statusCell.font = { color: { argb: 'FF006100' }, bold: true, size: 9 };
    } else if (tc.status === 'Fail') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      statusCell.font = { color: { argb: 'FF9C0006' }, bold: true, size: 9 };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
      statusCell.font = { color: { argb: 'FF9C6500' }, bold: true, size: 9 };
    }

    if (tc.screenshot) {
      const imgPath = path.resolve(__dirname, tc.screenshot);
      if (fs.existsSync(imgPath)) {
        try {
          const imageId = workbook.addImage({
            filename: imgPath,
            extension: 'png',
          });
          sheet.addImage(imageId, {
            tl: { col: 5, row: rowIndex - 1 },
            ext: { width: 120, height: 65 },
          });
        } catch (err) {
          console.log(`Could not embed image for ${tc.id}: ${err.message}`);
        }
      } else {
        console.log(`Screenshot NOT FOUND for ${tc.id}: ${imgPath}`);
      }
    }

    rowIndex++;
  }

  // Add borders to all used cells
  const lastRow = rowIndex - 1;
  for (let r = 1; r <= lastRow; r++) {
    for (let c = 1; c <= 6; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    }
  }

  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const outputPath = path.resolve(__dirname, 'PikPart_Test_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`\nReport generated: ${outputPath}`);
}

generateReport().catch((err) => {
  console.error('Failed to generate report:', err.message);
});