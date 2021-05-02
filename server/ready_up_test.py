'''Test file when user finishes the game'''
from collections import OrderedDict
import os
import sys
import unittest
sys.path.append(os.path.abspath('../'))
import app


KEY_INPUT = "input"
KEY_EXPECTED = "expected"


class UserReadyStatus(unittest.TestCase):
    '''Test class to check player-finished function works correctly'''
    def setUp(self):

        self.success_test_params = [{
            KEY_INPUT: {'playerEmail': 'Akash@beatthekeys.com', 'room': 'Multiplayer', 'T/F': False},
            KEY_EXPECTED: ([], False)
        }, {
            KEY_INPUT: {'playerEmail': 'AJ@beatthekeys.com', 'room': 'Multiplayer', 'T/F': True},
            KEY_EXPECTED: (['AJ@beatthekeys.com'], True)

        }, {
            KEY_INPUT: {'playerEmail': 'Yusef@beatthekeys.com', 'room': '1234', 'T/F': False},
            KEY_EXPECTED: ([], False)

        }, {
            KEY_INPUT: {'playerEmail': 'Mann@beatthekeys.com', 'room': '4321', 'T/F': True},
            KEY_EXPECTED: (['Mann@beatthekeys.com'], True)

        }]

        self.failure_test_params = [{
            KEY_INPUT: {'playerEmail': 'Akash@beatthekeys.com', 'room': 'Multiplayer', 'T/F': False},
            KEY_EXPECTED: (['Akash@beatthekeys.com'], False)
        }, {
            KEY_INPUT: {'playerEmail': 'AJ@beatthekeys.com', 'room': 'Multiplayer', 'T/F': True},
            KEY_EXPECTED: ([], False)

        }, {
            KEY_INPUT: {'playerEmail': 'Yusef@beatthekeys.com', 'room': '1234', 'T/F': False},
            KEY_EXPECTED: ([], True)

        }, {
            KEY_INPUT: {'playerEmail': 'Mann@beatthekeys.com', 'room': '4321', 'T/F': True},
            KEY_EXPECTED: (['Mann@beatthekeys.com', ''], False)

        }]

    def test_player_finished_success(self):
        '''Test function to check all the players are in the list of finished'''
        for test in self.success_test_params:
            app.ROOMS[test[KEY_INPUT]['room']] = {}
            app.ROOMS[test[KEY_INPUT]['room']]['activePlayers'] = OrderedDict()
            app.ROOMS[test[KEY_INPUT]['room']]['activePlayers'][test[KEY_INPUT]['playerEmail']] = [0, "icon", test[KEY_INPUT]['T/F'], "player_joined_late(T/F)"]

            actual_result = app.send_ready_up_status(test[KEY_INPUT]['room'])
            expected_result = test[KEY_EXPECTED]

            print("Success", actual_result, expected_result)

            self.assertEqual(actual_result, expected_result)
            self.assertEqual(
                actual_result[len(actual_result[0])-1],
                expected_result[len(expected_result[0])-1]
            )

    def test_player_finished_failure(self):
        '''Test function to check all the players are not in the finished list'''
        for test in self.failure_test_params:
            app.ROOMS[test[KEY_INPUT]['room']] = {}
            app.ROOMS[test[KEY_INPUT]['room']]['activePlayers'] = OrderedDict()
            app.ROOMS[test[KEY_INPUT]['room']]['activePlayers'][test[KEY_INPUT]['playerEmail']] = [0, "icon", test[KEY_INPUT]['T/F'], "player_joined_late(T/F)"]

            actual_result = app.send_ready_up_status(test[KEY_INPUT]['room'])
            expected_result = test[KEY_EXPECTED]

            print("Success", actual_result, expected_result)

            self.assertNotEqual(actual_result, expected_result)
            self.assertNotEqual(
                actual_result[len(actual_result[0])-1],
                expected_result[len(expected_result[0])-1]
            )

if __name__ == '__main__':
    unittest.main()
