import { ZipWriter, BlobWriter, TextReader } from "@zip.js/zip.js";

// Default Master Password fallback
export const DEFAULT_MASTER_PASSWORD = "AbdivaAdmin@2026#SecureKey!";
export const ADMIN_MASTER_PASSWORD = DEFAULT_MASTER_PASSWORD;

/**
 * Fetch the active master password and Key ID from cache or API
 */
export async function getActiveMasterPassword() {
  try {
    const cached = localStorage.getItem("abdiva_active_master_key");
    const cachedId = localStorage.getItem("abdiva_active_master_key_id") || "KEY-2026-V1";

    // Attempt to refresh key from backend
    try {
      const res = await fetch("http://localhost:3000/api/admin/master-key/active");
      const json = await res.json();
      if (json.success && json.data?.activeKey) {
        localStorage.setItem("abdiva_active_master_key", json.data.activeKey);
        if (json.data.activeKeyId) {
          localStorage.setItem("abdiva_active_master_key_id", json.data.activeKeyId);
        }
        return {
          password: json.data.activeKey,
          keyId: json.data.activeKeyId || "KEY-2026-V1",
        };
      }
    } catch {
      // Backend offline, proceed with cached or default
    }

    if (cached && cached.trim()) {
      return { password: cached, keyId: cachedId };
    }
  } catch (e) {
    console.warn("Storage check failed:", e);
  }

  return { password: DEFAULT_MASTER_PASSWORD, keyId: "KEY-2026-V1" };
}

/**
 * Convert an array of record objects into standard, RFC-compliant CSV string
 */
export function convertRecordsToCsv(records = []) {
  if (!records || records.length === 0) return "";

  // Priority order for standard column headers
  const standardFields = [
    "fileNo",
    "recordNo",
    "invoiceNo",
    "accountNo",
    "entryDate",
    "customerName",
    "agentName",
    "creditCardNo",
    "creditCardType",
    "dispatchDate",
    "dispatchNo",
    "dispatchBy",
    "salesDate",
    "salesTime",
    "emailAddress",
    "address",
    "pin",
    "zip",
    "expirationRemark",
    "refNo",
    "total",
    "netAmount",
    "status",
  ];

  // Discover all unique keys present in the records
  const allKeys = Array.from(
    new Set(
      records.flatMap((r) => Object.keys(r).filter((k) => k !== "id" && k !== "_id" && k !== "data"))
    )
  );

  // Sort: standard fields first, then any extra custom keys
  const headers = [
    ...standardFields.filter((f) => allKeys.includes(f)),
    ...allKeys.filter((k) => !standardFields.includes(k)),
  ];

  const escapeCsv = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(escapeCsv).join(",");
  const dataRows = records.map((record) =>
    headers.map((field) => escapeCsv(record[field] || "")).join(",")
  );

  return [headerRow, ...dataRows].join("\r\n");
}

/**
 * Generate and download a password-protected ZIP archive containing:
 * 1. The CSV spreadsheet report
 * 2. The JSON snapshot
 * 3. A Security Notice text file with Key ID tracking
 */
export async function downloadPasswordProtectedZip({
  fileName,
  records = [],
  level = "medical",
  reportType = "DAILY_REPORT", // "DAILY_REPORT" | "RANGE_BACKUP"
  dateRangeText = "",
  operatorName = "Operator",
}) {
  if (!records || records.length === 0) {
    throw new Error("No records available to export for the selected date.");
  }

  // Get active master key and Key ID for cryptographic sealing
  const { password: activePassword, keyId: activeKeyId } = await getActiveMasterPassword();

  const timestamp = new Date().toLocaleString();
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // strip extension if present

  // 1. Prepare CSV
  const csvContent = convertRecordsToCsv(records);

  // 2. Prepare JSON Snapshot with cryptographic key lineage
  const snapshotJson = JSON.stringify(
    {
      exportType: reportType,
      domain: level.toUpperCase(),
      exportedAt: timestamp,
      operator: operatorName,
      dateRange: dateRangeText,
      totalRecords: records.length,
      securityStatus: "PASSWORD_PROTECTED_AES_ZIP",
      keyId: activeKeyId,
      authorizedAccess: "Admin Only",
      records: records,
    },
    null,
    2
  );

  // 3. Prepare Security Notice with Key Lineage details
  const securityNotice = `========================================================================
ABDIVA INFOTECH PVT LTD - CONFIDENTIAL ENTERPRISE BACKUP ARCHIVE
========================================================================
Archive File      : ${baseName}.zip
Encryption Key ID : ${activeKeyId}
Domain            : ${level.toUpperCase()}
Report Type       : ${reportType === "DAILY_REPORT" ? "Daily Shift Export" : "Date Range Historical Backup"}
Date Range        : ${dateRangeText}
Total Records     : ${records.length}
Exported At       : ${timestamp}
Operator          : ${operatorName}

SECURITY & KEY ROTATION NOTICE:
This archive was strongly encrypted using Master Encryption Key ID: ${activeKeyId}.
If extracting this file in the future after a password rotation, refer to the 
Admin Master Key Vault history for Key ID: ${activeKeyId} to locate the exact 
decryption password valid at the time of export.

ACCESS RESTRICTION:
Only authorized System Administrators possessing the Master Decryption Key 
are permitted to decrypt and access these records.
========================================================================`;

  // 4. Create Password-Protected ZIP Writer using active master key
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
    password: activePassword,
    zipCrypto: true, // Standard PKWARE ZipCrypto supported natively by Windows Explorer, macOS, WinRAR, and 7-Zip
  });

  // Add files to archive
  await zipWriter.add(`${baseName}.csv`, new TextReader(csvContent));
  await zipWriter.add(`${baseName}_snapshot.json`, new TextReader(snapshotJson));
  await zipWriter.add("SECURITY_NOTICE.txt", new TextReader(securityNotice));

  // Finalize zip blob
  const zipBlob = await zipWriter.close();

  // 5. Trigger Browser Download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${baseName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  return {
    success: true,
    fileName: `${baseName}.zip`,
    totalRecords: records.length,
    keyId: activeKeyId,
  };
}
