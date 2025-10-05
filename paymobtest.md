| Card Type            | Card Number           | Cardholder Name | Expiry Month | Expiry Year | CVV      | Additional Notes                               |
|----------------------|-----------------------|-----------------|--------------|-------------|---------|------------------------------------------------|
| Mastercard (Test)    | 5123456789012346       | Test Account    | 12           | 25          | 123     | Primary testing card, detailed in docs        |
| Mastercard (Simulation)| 5123450000000008     | TEST CARD       | 01           | 39          | 123     | Simulation card for alternative tests         |
| VISA (Simulation)    | 4111111111111111       | Test Account    | 12           | 25          | 123     | Simulate successful/failed VISA transactions |

| Wallet Test Credentials | Wallet Number | MPin Code | OTP    | Notes                            |
|-------------------------|--------------|-----------|--------|---------------------------------|
| Wallet (Default)       | 01010101010  | 123456    | 123456 | For testing wallet transactions |

taskkill /IM "node.exe" /F
npx next dev


does this bypass ?
curl --insecure "https://suzi-superprepared-marlin.ngrok-free.dev/payments/return?id=352014559&pending=false&amount_cents=39999&success=true&is_auth=false&is_capture=false&is_standalone_payment=true&is_voided=false&is_refunded=false&is_3d_secure=true&integration_id=5113123&profile_id=1049373&has_parent_transaction=false&order=396293304&created_at=2025-10-05T04%3A19%3A39.205828&currency=EGP&merchant_commission=0&accept_fees=0&discount_details=%5B%5D&is_void=false&is_refund=false&error_occured=false&refunded_amount_cents=0&captured_amount=0&updated_at=2025-10-05T04%3A19%3A57.756171&is_settled=false&bill_balanced=false&is_bill=false&owner=1976079&merchant_order_id=cmgd0l3w30001ft7ssvxzxfag&data.message=Approved&source_data.type=card&source_data.pan=2346&source_data.sub_type=MasterCard&acq_response_code=00&txn_response_code=APPROVED&hmac=ae9c3ea4ca2abd6bd4aa6f9ad6829a109c44d1a3920897560da11f395dcf5665c774a183947a685f7960a9261b66a545226849a4190cfc49c390ab3468f9d673"
