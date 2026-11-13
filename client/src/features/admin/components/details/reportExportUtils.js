/**
 * Export and Download Utility for Medical & Telecom Reports
 */
import { formatRecordNumber } from "../../../../utils/recordNumberUtils.js";

// Exact Medical CSV Columns (Notebook 1 - 21 inputs + totals)
export const MEDICAL_CSV_COLUMNS = [
  // Row 1: File no | Record no | Entry date
  { key: "fileNo", label: "File No" },
  { key: "recordNo", label: "Record No" },
  { key: "entryDate", label: "Entry Date" },
  { key: "entryTime", label: "Entry Time" },
  // Row 2: Ref no | Invoice no | Courier name
  { key: "refNo", label: "Ref No" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "courierName", label: "Courier Name" },
  // Row 3: CON no | Dispatch date | Dispatch by
  { key: "conNo", label: "CON No" },
  { key: "dispatchDate", label: "Dispatch Date" },
  { key: "dispatchBy", label: "Dispatch By" },
  // Row 4: Sales date | Sales time | Customer name
  { key: "salesDate", label: "Sales Date" },
  { key: "salesTime", label: "Sales Time" },
  { key: "customerName", label: "Customer Name" },
  // Row 5: EMAIL ADDRESS | Agent Name | Address
  { key: "emailAddress", label: "Email Address" },
  { key: "agentName", label: "Agent Name" },
  { key: "address", label: "Address" },
  // Row 6: CITY | STATE | ZIP
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "Zip" },
  // Row 7: CUSTOMER PHONE | Credit card Type | Credit card number
  { key: "customerPhone", label: "Customer Phone" },
  { key: "creditCardType", label: "Credit Card Type" },
  { key: "creditCardNo", label: "Credit Card Number" },
  // Totals
  { key: "total", label: "Total Amount" },
  { key: "discount", label: "Discount" },
  { key: "netAmount", label: "Net Amount" },
  { key: "amountInWords", label: "Amount In Words" },
  { key: "remark", label: "Remark" },
  { key: "level", label: "Domain" },
];

// Exact Telecom CSV Columns (Notebook 2 - 33 inputs)
export const TELECOM_CSV_COLUMNS = [
  // Row 1: File no | Record no | Invoice no
  { key: "fileNo", label: "File No" },
  { key: "recordNo", label: "Record No" },
  { key: "invoiceNo", label: "Invoice No" },
  // Row 2: Invoice date | Phone no | Price Plans
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "phoneNo", label: "Phone No" },
  { key: "pricePlans", label: "Price Plans" },
  // Row 3: Device name | Phone cost | Monthly cost
  { key: "deviceName", label: "Device Name" },
  { key: "phoneCost", label: "Phone Cost" },
  { key: "monthlyCost", label: "Monthly Cost" },
  // Row 4: MMS | Texts | Extra value
  { key: "mms", label: "MMS" },
  { key: "texts", label: "Texts" },
  { key: "extraValueIncluded", label: "Extra Value" },
  // Row 5: Customer Type | Customer Name | Initials
  { key: "customerType", label: "Customer Type" },
  { key: "customerName", label: "Customer Name" },
  { key: "initials", label: "Initials" },
  // Row 6: Company name | Customer Address | Email
  { key: "companyName", label: "Company Name" },
  { key: "address", label: "Customer Address" },
  { key: "emailAddress", label: "Email" },
  // Row 7: City | State | Zip
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "Zip" },
  // Row 8: Residence type | Agent no | Agent name
  { key: "residenceType", label: "Residence Type" },
  { key: "agentNo", label: "Agent No" },
  { key: "agentName", label: "Agent Name" },
  // Row 9: Agency code | Agency name | Deposit
  { key: "agencyCode", label: "Agency Code" },
  { key: "agencyName", label: "Agency Name" },
  { key: "deposit", label: "Deposit" },
  // Row 10: Balance | Credit card type | Card no
  { key: "balance", label: "Balance" },
  { key: "creditCardType", label: "Credit Card Type" },
  { key: "creditCardNo", label: "Card No" },
  // Row 11: Card Expiry date | Credit rate | Remark
  { key: "cardExpiryDate", label: "Card Expiry Date" },
  { key: "creditRate", label: "Credit Rate" },
  { key: "remark", label: "Remark" },
  { key: "level", label: "Domain" },
];

export const CSV_COLUMNS = MEDICAL_CSV_COLUMNS;

const escapeCsv = (val) => {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * Download an array of reports as a formatted CSV file
 */
export const exportReportsToCsv = (reportsList, filename = "reports_export.csv") => {
  if (!reportsList || reportsList.length === 0) {
    alert("No records to export.");
    return false;
  }

  const isTel = reportsList.some((r) => r.level === "telecom" || Boolean(r.deviceName || r.phoneCost || r.pricePlans));
  const cols = isTel ? TELECOM_CSV_COLUMNS : MEDICAL_CSV_COLUMNS;

  const headerRow = cols.map((c) => escapeCsv(c.label)).join(",");
  const dataRows = reportsList.map((rep) => {
    return cols.map((c) => {
      let val = rep[c.key];
      if (val === undefined || val === null) {
        if (c.key === "customerName") val = rep.custName || rep["Customer Name"];
        else if (c.key === "emailAddress") val = rep.email;
        else if (c.key === "address") val = rep.customerAddress || rep.custAddress;
        else if (c.key === "recordNo") val = rep["Record No"];
        else if (c.key === "fileNo") val = rep["File No"];
        else if (c.key === "invoiceNo") val = rep["Invoice No"];
        else if (c.key === "refNo") val = rep["Ref No"];
        else if (c.key === "courierName") val = rep.accountNo || rep["Courier Name"];
        else if (c.key === "conNo") val = rep["CON No"];
        else if (c.key === "customerPhone" || c.key === "phoneNo") val = rep.phoneNo || rep.customerPhone || rep["Customer Phone"];
        else if (c.key === "zip") val = rep.pin;
        else if (c.key === "entryDate") val = rep["Entry Date"] || rep["Entry Dates"];
        else if (c.key === "entryTime") {
          const timestamp = rep.createdAt || rep.timestamp;
          const date = timestamp ? new Date(timestamp) : null;
          val = date && !Number.isNaN(date.getTime())
            ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
            : "";
        }
        else if (c.key === "invoiceDate") val = rep["Invoice Date"] || rep.entryDate;
      }
      if (c.key === "recordNo") val = formatRecordNumber(val ?? rep["Record No"]);
      return escapeCsv(val || "");
    }).join(",");
  });

  // UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

/**
 * Download a single report as CSV
 */
export const downloadSingleReportCsv = (report, operatorName = "operator") => {
  if (!report) return;
  const recNo = report.recordNo || report["Record No"] || report.id || "1";
  const domain = report.level || "report";
  const filename = `${operatorName}_${domain}_${recNo}.csv`;
  exportReportsToCsv([report], filename);
};

/**
 * Download all reports as CSV
 */
export const downloadAllReportsCsv = (reportsList, operatorName = "operator", filterLabel = "all") => {
  const dateStr = new Date().toISOString().split("T")[0];
  const suffix = filterLabel !== "all" ? `_${filterLabel}` : "";
  const filename = `${operatorName}${suffix}_reports_${dateStr}.csv`;
  exportReportsToCsv(reportsList, filename);
};
