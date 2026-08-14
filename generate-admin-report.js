const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateReport() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Admin Retailer Tests');

  sheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  sheet.columns = [
    { header: 'Test ID', key: 'id', width: 10 },
    { header: 'Type', key: 'type', width: 11 },
    { header: 'Test Case', key: 'testcase', width: 26 },
    { header: 'Expected Result', key: 'expected', width: 30 },
    { header: 'Actual Result', key: 'actual', width: 30 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Bug Found?', key: 'bug', width: 30 },
    { header: 'Screenshot', key: 'screenshot', width: 22 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  sheet.getRow(1).height = 20;

  const testCases = [
    {
      id: 'NEG-01', type: 'Negative', testcase: 'Submit with all fields empty',
      expected: "Validation messages shown for all mandatory fields",
      actual: 'Validation messages displayed correctly',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg01-empty-submit.png',
    },
    {
      id: 'NEG-02', type: 'Negative', testcase: 'Phone Number rejects alphabetic input',
      expected: 'Field should reject non-numeric characters',
      actual: 'type="number" blocks letters at browser level, field stays empty',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg02-invalid-phone.png',
    },
    {
      id: 'NEG-03', type: 'Negative', testcase: 'Pincode accepts alphabetic input',
      expected: 'Field should reject non-numeric characters',
      actual: 'type="text" has no validation - letters typed in successfully',
      status: 'Pass (test)', bug: 'YES - Pincode field accepts letters, no client-side validation (unlike Phone Number)',
      screenshot: 'screenshots/neg03-invalid-pincode-bug.png',
    },
    {
      id: 'NEG-04', type: 'Negative', testcase: 'Phone Number too short (3 digits)',
      expected: 'Form should reject incomplete phone number',
      actual: 'Rejected as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg04-short-phone.png',
    },
    {
      id: 'NEG-05', type: 'Negative', testcase: 'Invalid email format',
      expected: 'Form should flag invalid email format',
      actual: 'Rejected as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg05-invalid-email.png',
    },
    {
      id: 'NEG-06', type: 'Negative', testcase: 'Pincode too short (3 digits)',
      expected: 'Form should reject incomplete pincode',
      actual: 'Rejected as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg06-short-pincode.png',
    },
    {
      id: 'NEG-07', type: 'Negative', testcase: 'Mandatory Shop Name left empty',
      expected: 'Form should block submission, flag missing Shop Name',
      actual: 'Rejected as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/neg07-empty-shopname.png',
    },
    {
      id: 'CHECK-01', type: 'Field Check', testcase: 'Upload PDF buttons & Shop Image icon clickable',
      expected: 'All upload controls visible and enabled',
      actual: 'Confirmed visible and enabled',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/check01-upload-buttons.png',
    },
    {
      id: 'CHECK-02', type: 'Field Check', testcase: 'Retailer Type dropdown options',
      expected: "Dropdown shows '2W' and '4W'",
      actual: 'Both options visible as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/check02-retailer-type-dropdown.png',
    },
    {
      id: 'CHECK-03', type: 'Field Check', testcase: 'Lead Type dropdown options',
      expected: "Dropdown shows 'App', 'Offline Lead', 'Campaign', 'Meta'",
      actual: 'All 4 options visible as expected',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/check03-lead-type-dropdown.png',
    },
    {
      id: 'POS-01', type: 'Positive', testcase: 'All fields filled correctly (Submit not clicked)',
      expected: 'Form accepts all valid input, Submit enabled',
      actual: 'Form fully filled, Submit visible & enabled. Not clicked intentionally.',
      status: 'Pass', bug: 'No',
      screenshot: 'screenshots/pos01-form-fully-filled.png',
    },
  ];

  let rowIndex = 2;

  for (const tc of testCases) {
    const row = sheet.addRow({
      id: tc.id,
      type: tc.type,
      testcase: tc.testcase,
      expected: tc.expected,
      actual: tc.actual,
      status: tc.status,
      bug: tc.bug,
    });

    row.alignment = { vertical: 'top', wrapText: true };
    row.font = { size: 9 };
    row.height = 70;

    const statusCell = row.getCell('status');
    statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
    if (tc.status.includes('Pass')) {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
      statusCell.font = { color: { argb: 'FF006100' }, bold: true, size: 9 };
    } else {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      statusCell.font = { color: { argb: 'FF9C0006' }, bold: true, size: 9 };
    }

    const bugCell = row.getCell('bug');
    if (tc.bug !== 'No') {
      bugCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      bugCell.font = { color: { argb: 'FF9C0006' }, bold: true, size: 9 };
    } else {
      bugCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
      bugCell.font = { color: { argb: 'FF006100' }, size: 9 };
    }

    if (tc.screenshot) {
      const imgPath = path.resolve(__dirname, tc.screenshot);
      if (fs.existsSync(imgPath)) {
        try {
          const imageId = workbook.addImage({ filename: imgPath, extension: 'png' });
          sheet.addImage(imageId, {
            tl: { col: 7, row: rowIndex - 1 },
            ext: { width: 140, height: 75 },
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

  const lastRow = rowIndex - 1;
  for (let r = 1; r <= lastRow; r++) {
    for (let c = 1; c <= 8; c++) {
      sheet.getCell(r, c).border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
      };
    }
  }

  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const summary = workbook.addWorksheet('Summary');
  summary.columns = [
    { header: 'Metric', key: 'metric', width: 26 },
    { header: 'Count', key: 'count', width: 14 },
  ];
  summary.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summary.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };

  const total = testCases.length;
  const negative = testCases.filter(t => t.type === 'Negative').length;
  const positive = testCases.filter(t => t.type === 'Positive').length;
  const checks = testCases.filter(t => t.type === 'Field Check').length;
  const bugs = testCases.filter(t => t.bug !== 'No').length;
  const passed = testCases.filter(t => t.status.includes('Pass')).length;

  summary.addRow({ metric: 'Total Test Cases', count: total });
  summary.addRow({ metric: 'Negative Test Cases', count: negative });
  summary.addRow({ metric: 'Positive Test Cases', count: positive });
  summary.addRow({ metric: 'Field/Button Checks', count: checks });
  summary.addRow({ metric: 'Passed', count: passed });
  summary.addRow({ metric: 'Bugs Found', count: bugs });

  summary.addRow({});
  const bugTitleRow = summary.addRow({ metric: 'Bug Summary' });
  bugTitleRow.getCell(1).font = { bold: true, color: { argb: 'FF9C0006' }, size: 12 };

  const bugRow = summary.addRow({
    metric: 'BUG-01 (NEG-03): Pincode field on Add New Retailer form accepts alphabetic characters. ' +
      'Unlike Phone Number (type="number", blocks letters), Pincode is type="text" with no numeric validation. ' +
      'Recommend adding numeric-only + 6-digit pattern validation.',
  });
  summary.mergeCells(`A${bugRow.number}:B${bugRow.number}`);
  bugRow.getCell(1).alignment = { wrapText: true, vertical: 'top' };
  bugRow.height = 60;

  const outputPath = path.resolve(__dirname, 'PikPart_Admin_Retailer_Test_Report.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`\nReport generated: ${outputPath}`);
}

generateReport().catch((err) => {
  console.error('Failed to generate report:', err.message);
});