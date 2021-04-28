"""This test is to see if we correctly fetch data from the DB"""
import unittest
from unittest.mock import patch
import os
import sys


sys.path.append(os.path.abspath('../'))
from app import simple_fetch_db
from models import Users



KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME1 = 'user1'
INITIAL_EMAIL1 = 'email@host.com'
INITIAL_ICON1 = 'smiley'
INITIAL_WPM1 = 60

INITIAL_USERNAME2 = 'user2'
INITIAL_EMAIL2 = 'email@njit.edu'
INITIAL_ICON2 = 'frowning'
INITIAL_WPM2 = 100

class GetUserFromDBTest(unittest.TestCase):
    """Main class to test DB logic"""
    def setUp(self):
        self.success_test_params = [
            {
                KEY_EXPECTED: (['user1', 'user2'], ['email@host.com','email@njit.edu'],
                               ['smiley','frowning'],[60, 100]),
            },
        ]

        initial_person1 = Users(username=INITIAL_USERNAME1, email=INITIAL_EMAIL1,
                                      icon=INITIAL_ICON1, bestwpm=INITIAL_WPM1)
        initial_person2 = Users(username=INITIAL_USERNAME2, email=INITIAL_EMAIL2,
                                      icon=INITIAL_ICON2, bestwpm=INITIAL_WPM2)
        self.initial_db_mock = [initial_person1, initial_person2]

    def mocked_person_query_all(self):
        """Helper function to mock DB query"""
        return self.initial_db_mock

    def test_success(self):
        """Main Logic function where tests are run"""
        for test in self.success_test_params:
            with patch('models.Users.query') as mocked_query:
                        
                mocked_query.all = self.mocked_person_query_all
                actual_result = simple_fetch_db()
                
                print("MOCKED DB:", self.initial_db_mock)
                print("ACTUAL RESULT:", actual_result)
                
                expected_result = test[KEY_EXPECTED]
                
                print("EXPECTED RESULT:", expected_result)
                self.assertEqual(actual_result, expected_result)
                self.assertEqual(len(actual_result), len(expected_result))


if __name__ == '__main__':
    unittest.main()
