export const formatRecordNumber = (value) => {
  const recordNumber = String(value ?? "");
  return /^0\d{2}$/.test(recordNumber) ? recordNumber.slice(1) : recordNumber;
};
