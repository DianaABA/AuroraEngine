export const styles = `
.ae-line {
  min-height: 40px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  color: #e5e7ff;
  font-size: 15px;
}
.ae-name {
  font-weight: 700;
  color: #a0e7ff;
}
.ae-choices {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.ae-choices-hint {
  width: 100%;
  color: #8aa0e0;
  font-size: 12px;
  margin-bottom: 4px;
}
.ae-choices button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #27304a;
  background: #0b1020;
  color: #a8b0ff;
  cursor: pointer;
}
.ae-choices button:hover {
  border-color: #3e59ff;
}
.ae-choices button[data-default='true'] {
  border-color: #3e59ff;
}
.ae-choices-badge {
  margin-left: 8px;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background: #111827;
  border: 1px solid #27304a;
  color: #a0e7ff;
}
.ae-next {
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #27304a;
  background: #111827;
  color: #a0e7ff;
  cursor: pointer;
}
`
