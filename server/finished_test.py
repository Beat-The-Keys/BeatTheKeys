'''Test file when user finishes the game'''
from collections import OrderedDict
import os
import sys
import unittest
import app
sys.path.append(os.path.abspath('./'))


KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserLogoutTest(unittest.TestCase):
    '''Test class to check player-finished function works correctly'''
    def setUp(self):
        app.ROOMS['Multiplayer'] = {}
        app.ROOMS['Multiplayer']['playersFinished'] = []
        app.ROOMS['Multiplayer']['activePlayers'] = OrderedDict([('AJ', 200),
                ('Akash', 13), ('Yusef', 130), ('Mann', 1)])

        self.success_test_params = [{
            KEY_INPUT: {'playerName': 'Akash', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash']
        }, {
            KEY_INPUT: {'playerName': 'AJ', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash', 'AJ']

        },{
            KEY_INPUT: {'playerName': 'Yusef', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash', 'AJ', 'Yusef']

        }, {
            KEY_INPUT: {'playerName': 'Mann', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash', 'AJ', 'Yusef', 'Mann']

        }]

        self.failure_test_params = [{
            KEY_INPUT: {'playerName': 'Akash', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash', 'AJ', 'Yusef', 'Mann']
        }, {
            KEY_INPUT: {'playerName': 'AJ', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Mann']

        },{
            KEY_INPUT: {'playerName': 'Yusef', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['AJ', 'Yusef', 'Mann']

        }, {
            KEY_INPUT: {'playerName': 'Mann', 'room': 'Multiplayer'},
            KEY_EXPECTED: ['Akash', 'Yusef']

        }]

    def test_player_finished_success(self):
        '''Test function to check all the players are in the list of finished'''
        for test in self.success_test_params:
            actual_result = app.player_finished(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            print("Success", actual_result, expected_result)

            self.assertEqual(actual_result, expected_result)
            self.assertEqual(actual_result[len(actual_result)-1],
                                expected_result[len(expected_result)-1])

    def test_player_finished_failure(self):
        '''Test function to check all the players are not in the finished list'''
        for test in self.failure_test_params:
            actual_result = app.player_finished(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            print("Failure", actual_result, expected_result)

            self.assertNotEqual(actual_result, expected_result)
            self.assertNotEqual(actual_result[len(actual_result)-1],
                                    expected_result[len(expected_result)-1])

if __name__ == '__main__':
    unittest.main()
