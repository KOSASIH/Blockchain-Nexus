import requests
from config import Config

class ChaseBankAPI:
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {Config.CHASE_BANK_API_KEY}",
            "Content-Type": "application/json"
        }

    def get_account_balance(self, account_id):
        url = f"{Config.CHASE_BANK_BASE_URL}/accounts/{account_id}/balance"
        response = requests.get(url, headers=self.headers)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error retrieving balance: {response.status_code} - {response.text}")

    def get_transaction_history(self, account_id):
        url = f"{Config.CHASE_BANK_BASE_URL}/accounts/{account_id}/transactions"
        response = requests.get(url, headers=self.headers)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error retrieving transactions: {response.status_code} - {response.text}")

# Example usage
if __name__ == "__main__":
    chase_api = ChaseBankAPI()
    try:
        account_id = "123456789"  # Replace with a valid account ID
        balance = chase_api.get_account_balance(account_id)
        print("Account Balance:", balance)

        transactions = chase_api.get_transaction_history(account_id)
        print("Transaction History:", transactions)

    except Exception as e:
        print("An error occurred:", e)