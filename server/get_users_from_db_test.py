import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
from app import fetch_db
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'
INITIAL_EMAIL = 'email@host.com'
INITIAL_ICON = 'smiley'
INITIAL_WPM = 60
INITIAL_LIST = [['Alexander Ong', 'Group2 YWCC 307', 'Group 4 CS 490'], ['ajo28@njit.edu', 'group2ywcc@gmail.com', 'beat.the.keys4@gmail.com'],
['smiley', 'grinning', 'smiling_imp'], [50, 20, 80]]

class GetUserFromDBTest(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'wpm',
                KEY_EXPECTED: (['Group 4 CS 490', 'Alexander Ong', 'Group2 YWCC 307'], ['beat.the.keys4@gmail.com', 'ajo28@njit.edu', 'group2ywcc@gmail.com'],
                ['smiling_imp', 'smiley', 'grinning'], [80, 50, 20])
            },
            {
                KEY_INPUT: 'email',
                KEY_EXPECTED: (['Alexander Ong', 'Group 4 CS 490', 'Group2 YWCC 307'], ['ajo28@njit.edu', 'beat.the.keys4@gmail.com', 'group2ywcc@gmail.com'],
                ['smiley', 'smiling_imp', 'grinning'], [50, 80, 20])
            },
            {
                KEY_INPUT: ' ',
                KEY_EXPECTED: (INITIAL_LIST[0], INITIAL_LIST[1], INITIAL_LIST[2], INITIAL_LIST[3]),
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
                        actual_result = fetch_db(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(expected_result)
                        print('---------------------------------------')
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()