'''Test file when users wpm updates'''
from collections import OrderedDict
import os
import sys
import unittest
sys.path.append(os.path.abspath('../'))
import app


KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserUpdateTest(unittest.TestCase):
    '''Test class to check update_player_stats function works correctly'''
    def setUp(self):
        app.ROOMS['Multiplayer'] = {}
        app.ROOMS['Multiplayer']['activePlayers'] = OrderedDict()

        self.success_test_params = [{
            KEY_INPUT: {'playerEmail': 'Akash@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 13},
            KEY_EXPECTED: app.ROOMS['Multiplayer']['activePlayers']
        }, {
            KEY_INPUT: {'playerEmail': 'AJ@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 130},
            KEY_EXPECTED: app.ROOMS['Multiplayer']['activePlayers']

        }, {
            KEY_INPUT: {'playerEmail': 'Yusef@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 200},
            KEY_EXPECTED: app.ROOMS['Multiplayer']['activePlayers']

        }, {
            KEY_INPUT: {'playerEmail': 'Mann@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 1},
            KEY_EXPECTED: app.ROOMS['Multiplayer']['activePlayers']

        }]

        self.failure_test_params = [{

            KEY_INPUT: {'playerEmail': 'Akash@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 13},
            KEY_EXPECTED: OrderedDict([('Akash@beatthekeys.com', [12, 'smiley'])])
        }, {
            KEY_INPUT: {'playerEmail': 'AJ@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 130},
            KEY_EXPECTED: OrderedDict([('AJ@beatthekeys.com', [200, ":happy:"]), ('Akash', 13)])

        }, {
            KEY_INPUT: {'playerEmail': 'Yusef@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 200},
            KEY_EXPECTED: OrderedDict([('Yusef@@beatthekeys.com', 13), ('AJ', [200, "joy:"])])

        }, {
            KEY_INPUT: {'playerEmail': 'Mann@beatthekeys.com', 'room': 'Multiplayer', 'wpm': 1},
            KEY_EXPECTED: OrderedDict([('Mann@beatthekeys.com', 13)])

        }]

    def tests_update_player_stats_success(self):
        '''Test function to check all the players wpm updates appropriately'''
        for test in self.success_test_params:
            test_player_email = test[KEY_INPUT]['playerEmail']
            app.ROOMS['Multiplayer']['activePlayers'][test_player_email] = [0, 0, False, False]
            actual_result = app.update_player_stats(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            print(actual_result, expected_result)
            print("Success", actual_result, expected_result)

            self.assertEqual(actual_result, expected_result)
            self.assertEqual(
                actual_result[test[KEY_INPUT]['playerEmail']],
                expected_result[test[KEY_INPUT]['playerEmail']]
            )

    def tests_update_player_stats_failure(self):
        '''Test function to check all the players wpm does not update appropriately'''
        for test in self.failure_test_params:
            test_player_email = test[KEY_INPUT]['playerEmail']
            app.ROOMS['Multiplayer']['activePlayers'][test_player_email] = [0, 0, False, False]
            actual_result = app.update_player_stats(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            print("Failure", actual_result, expected_result)

            self.assertNotEqual(actual_result, expected_result)
            self.assertNotEqual(actual_result[test[KEY_INPUT]['playerEmail']], expected_result)

if __name__ == '__main__':
    unittest.main()
