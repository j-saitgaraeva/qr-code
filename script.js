*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: #f5f5f7;
  color: #111827;
}

.app {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px 20px 32px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

.title {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 14px;
  color: #4b5563;
}

#url-input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

#url-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  background: #111827;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease,
    background-color 0.12s ease;
}

.btn:hover {
  background: #020617;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.25);
  transform: translateY(-1px);
}

.btn:active {
  box-shadow: none;
  transform: translateY(0);
}

.preview-wrapper {
  margin-top: 20px;
  text-align: center;
}

.qr-container {
  display: inline-block;
  padding: 12px;
  border-radius: 24px;
  background: #f9fafb;
}

.hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.footer {
  margin-top: 24px;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
}

@media (max-width: 480px) {
  .app {
    margin: 16px;
    padding: 20px 16px 24px;
  }

  .title {
    font-size: 20px;
  }
}
