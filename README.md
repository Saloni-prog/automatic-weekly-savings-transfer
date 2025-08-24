# automatic-weekly-savings-transfer
This program is an Automatic Weekly Savings Transfer System. It is designed to move a fixed amount of money from a checking account to a savings account once every week.
Key features:

Scheduled Execution – Runs automatically every week (via cron on Linux/macOS or Task Scheduler on Windows).
Idempotency – Prevents duplicate transfers by generating a unique key for each week. If the script runs multiple times in the same week, it won’t repeat the transaction.
Logging & Record Keeping – Saves all transfer attempts (success/failure) into a SQLite database (auto_savings.sqlite3) for easy tracking.
Customizable – You can change the transfer amount, currency, and account details in the config section.
API Integration Ready – The transfer_funds() function is a placeholder where you can connect to your bank’s API or a fintech service to actually perform the transfer.
Secure Credentials – Supports using environment variables to keep your API keys and sensitive information safe.
