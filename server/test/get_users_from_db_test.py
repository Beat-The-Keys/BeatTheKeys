"""This test is to see if we correctly fetch data from the DB"""
import unittest
from unittest.mock import patch
import os
import sys
sys.path.append('../')
from app import fetch_db
import models

sys.path.append(os.path.abspath('../'))


KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'
INITIAL_EMAIL = 'email@host.com'
INITIAL_ICON = 'smiley'
INITIAL_WPM = 60
INITIAL_LIST = [['Mann Patel', 'Yusef Mustafa', 'Akash Patel', 'Akash', 'Alexander Ong', 'AJ Ong', 'Yusef Mustafa', 'Group 4 CS 490', 'Alexander Ong', 'Group2 YWCC 307'], ['mmp224@njit.edu', 'yjm4@njit.edu', 'adp77@njit.edu', 'ap.akash.patel1999@gmail.com', 'mr.alexander.ong@gmail.com', 'ajong816@gmail.com', 'yusefm8@gmail.com', 'beat.the.keys4@gmail.com', 'ajo28@njit.edu', 'group2ywcc@gmail.com'], [None, 'joy', 'waffle', '+1', None, None, '+1', 'smiling_imp', 'crossed_fingers', 'grinning'], [None, None, None, None, None, None, None, 80, 50, 20]]

class GetUserFromDBTest(unittest.TestCase):
    """Main class to test DB logic"""
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'wpm',
                KEY_EXPECTED: (['Mann Patel', 'Yusef Mustafa', 'Akash Patel', 'Akash', 'Alexander Ong', 'AJ Ong', 'Yusef Mustafa', 'Group 4 CS 490', 'Alexander Ong', 'Group2 YWCC 307'], ['mmp224@njit.edu', 'yjm4@njit.edu', 'adp77@njit.edu', 'ap.akash.patel1999@gmail.com', 'mr.alexander.ong@gmail.com', 'ajong816@gmail.com', 'yusefm8@gmail.com', 'beat.the.keys4@gmail.com', 'ajo28@njit.edu', 'group2ywcc@gmail.com'], [None, 'joy', 'waffle', '+1', None, None, '+1', 'smiling_imp', 'crossed_fingers', 'grinning'], [None, None, None, None, None, None, None, 80, 50, 20])
            },
            {
                KEY_INPUT: 'email',
                KEY_EXPECTED: (['Yusef Mustafa', 'Yusef Mustafa', 'Alexander Ong', 'Mann Patel', 'Group2 YWCC 307', 'Group 4 CS 490', 'Akash', 'AJ Ong', 'Alexander Ong', 'Akash Patel'], ['yusefm8@gmail.com', 'yjm4@njit.edu', 'mr.alexander.ong@gmail.com', 'mmp224@njit.edu', 'group2ywcc@gmail.com', 'beat.the.keys4@gmail.com', 'ap.akash.patel1999@gmail.com', 'ajong816@gmail.com', 'ajo28@njit.edu', 'adp77@njit.edu'], ['+1', 'joy', None, None, 'grinning', 'smiling_imp', '+1', None, 'crossed_fingers', 'waffle'], [None, None, None, None, 20, 80, None, None, 50, None])
            },
            {
                KEY_INPUT: ' ',
                KEY_EXPECTED: (['AJ Ong', 'Akash', 'Akash Patel', 'Alexander Ong', 'Alexander Ong', 'Group2 YWCC 307', 'Group 4 CS 490', 'Mann Patel', 'Yusef Mustafa', 'Yusef Mustafa'], ['ajong816@gmail.com', 'ap.akash.patel1999@gmail.com', 'adp77@njit.edu', 'mr.alexander.ong@gmail.com', 'ajo28@njit.edu', 'group2ywcc@gmail.com', 'beat.the.keys4@gmail.com', 'mmp224@njit.edu', 'yjm4@njit.edu', 'yusefm8@gmail.com'], [None, '+1', 'waffle', None, 'crossed_fingers', 'grinning', 'smiling_imp', None, 'joy', '+1'], [None, None, None, None, 50, 20, 80, None, None, None]),
            },
        ]

        initial_person = models.Users(username=INITIAL_USERNAME, email=INITIAL_EMAIL,
                                      icon=INITIAL_ICON, bestwpm=INITIAL_WPM)
        self.initial_db_mock = [initial_person]

    def mocked_db_session_add(self, username):
        """Helper function to mock DB"""
        self.initial_db_mock.append(username)

    def mocked_db_session_commit(self):
        """Helper function to mock DB"""
        pass # pylint: disable=unnecessary-pass

    def mocked_person_query_all(self):
        """Helper function to mock DB"""
        return self.initial_db_mock

    def test_success(self):
        """Main Logic function where tests are run"""
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
