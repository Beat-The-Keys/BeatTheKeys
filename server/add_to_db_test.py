import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
from app import user_db_check
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'
INITIAL_EMAIL = 'email@host.com'
INITIAL_ICON = 'smiley'
INITIAL_WPM = 60

class AddToDBTest(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'AJ@nijt.edu',
                KEY_EXPECTED: [INITIAL_EMAIL, 'AJ@nijt.edu'],
            },
            {
                KEY_INPUT: 'Yusef@nijt.edu',
                KEY_EXPECTED: [INITIAL_EMAIL, 'Yusef@nijt.edu'],
            },
            {
                KEY_INPUT: 'Akash@nijt.edu',
                KEY_EXPECTED: [INITIAL_EMAIL, 'Akash@nijt.edu'],
            },
            {
                KEY_INPUT: 'Mann@nijt.edu',
                KEY_EXPECTED: [INITIAL_EMAIL, 'Mann@nijt.edu'],
            },
            
        ]
        
        initial_person = models.Users(username=INITIAL_USERNAME, email=INITIAL_EMAIL, icon=INITIAL_ICON, bestwpm=INITIAL_WPM)
        self.initial_db_mock = [initial_person]
    
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Users.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
    
                        actual_result = user_db_check(test[KEY_INPUT], [INITIAL_EMAIL], [INITIAL_USERNAME])
                        expected_result = test[KEY_EXPECTED]
                        print(actual_result)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()