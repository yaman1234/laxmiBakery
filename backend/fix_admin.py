import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017')
db = client['laxmi_bakery']
db.users.update_one(
    {'email': 'admin@example.com'}, 
    {'$set': {'full_name': 'Admin User'}}
)
print('Admin user updated with full_name successfully.')
