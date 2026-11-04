/**
 * Export and Download Utility for Medical & Telecom Reports
 */

export const CSV_COLUMNS = [
  { key: "recordNo", label: "Record No" },
  { key: "fileNo", label: "File No" },
  { key: "level", label: "Domain" },
  { key: "entryDate", label: "Entry Date" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "refNo", label: "Ref No" },
  { key: "customerName", label: "Customer Name" },
  { key: "emailAddress", label: "Email Address" },
  { key: "address", label: "Address" },
  { key: "pin", label: "PIN" },
  { key: "zip", label: "ZIP" },
  { key: "accountNo", label: "Account No" },
  { key: "dispatchNo", label: "Dispatch No" },
  { key: "dispatchDate", label: "Dispatch Date" },
  { key: "dispatchBy", label: "Dispatch By" },
  { key: "salesDate", label: "Sales Date" },
  { key: "salesTime", label: "Sales Time" },
  { key: "agentName", label: "Agent Name" },
  { key: "creditCardType", label: "Credit Card Type" },
  { key: "creditCardNo", label: "Credit Card No" },
  { key: "expirationRemark", label: "Expiration Remark" },
  { key: "subTotal", label: "Sub Total" },
  { key: "tax", label: "Tax" },
  { key: "discount", label: "Discount" },
  { key: "netAmount", label: "Net Amount" },
  { key: "total", label: "Total Amount" },
  { key: "amountInWords", label: "Amount In Words" },
  { key: "status", label: "Status" },
  { key: "remark", label: "Operator Remark" },
  // Telecom attributes
  { key: "phoneNo", label: "Phone No" },
  { key: "deviceName", label: "Device Name" },
  { key: "pricePlans", label: "Price Plan" },
  { key: "phoneCost", label: "Phone Cost" },
  { key: "monthlyCost", label: "Monthly Cost" },
  { key: "mms", label: "MMS" },
  { key: "texts", label: "Texts" },
  { key: "extraValueIncluded", label: "Extra Value" },
  { key: "customerType", label: "Customer Type" },
  { key: "initials", label: "Initials" },
  { key: "companyName", label: "Company Name" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "residenceType", label: "Residence Type" },
  { key: "agentNo", label: "Agent No" },
  { key: "agencyCode", label: "Agency Code" },
  { key: "agencyName", label: "Agency Name" },
  { key: "deposit", label: "Deposit" },
  { key: "balance", label: "Balance" },
  { key: "creditRate", label: "Credit Rate" },
];

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

  const headerRow = CSV_COLUMNS.map((c) => escapeCsv(c.label)).join(",");
  const dataRows = reportsList.map((rep) => {
    return CSV_COLUMNS.map((c) => {
      let val = rep[c.key];
      if (val === undefined || val === null) {
        if (c.key === "customerName") val = rep.custName || rep["Customer Name"];
        else if (c.key === "emailAddress") val = rep.email;
        else if (c.key === "address") val = rep.custAddress;
        else if (c.key === "recordNo") val = rep["Record No"];
        else if (c.key === "fileNo") val = rep["File No"];
        else if (c.key === "invoiceNo") val = rep["Invoice No"];
        else if (c.key === "refNo") val = rep["Ref No"];
        else if (c.key === "entryDate") val = rep["Entry Date"] || rep["Entry Dates"];
      }
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

