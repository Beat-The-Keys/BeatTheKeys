'''Test file when users wpm updates'''
from collections import OrderedDict
import os
import sys
import unittest
sys.path.append(os.path.abspath('../'))
import app


KEY_INPUT1 = "input"
KEY_EXPECTED = "expected"


class UserUpdateTest(unittest.TestCase):
    '''Test class to check update_player_stats function works correctly'''
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT1: [[150, 1841], [3, 20]],
            KEY_EXPECTED: [50, 92.05]
        }, {
            KEY_INPUT1: [[65, 34, 175], [1, 2, 2]],
            KEY_EXPECTED: [65, 17, 87.5]
        }, {
            KEY_INPUT1: [[3451, 1475, 2471, 0], [28, 14, 30, 0]],
            KEY_EXPECTED: [123.25, 105.36, 82.37, 0]
        }, {
            KEY_INPUT1: [[3451, 1475, 2471, 0], [28, 14, 30, 0]],
            KEY_EXPECTED: [123.25, 105.36, 82.37, 0]
        }]

    def tests_update_player_stats_success(self):
        '''Test function to check all the players wpm updates appropriately'''
        for test in self.success_test_params:
            totalwpm, totalgames = (test[KEY_INPUT1])
            actual_result = app.find_average(totalwpm, totalgames)
            expected_result = test[KEY_EXPECTED]
            print("Success", actual_result, expected_result)

            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()
