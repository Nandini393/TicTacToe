"""
Tic Tac Toe Player
"""

import math

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
                     
    return  [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]



def player(board):
    """
    Returns player who has the next turn on a board.
    """
    x_count = 0
    o_count = 0

    for row in range(len(board)):
        for col in range(3):
            if board[row][col] == X:
                x_count += 1
            elif board[row][col] == O:
                o_count += 1
    
    if  x_count <=  o_count:
        return X
    else:
        return O



def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    result = set()

    for row in range(3):
        for col in range(3):
            if board[row][col] == EMPTY:
                result.add((row,col))

    return result



def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """

    new_board = [row[:] for row in board]

    row, col = action

    if (row < 0 or row >= 3 or col < 0 or col >= 3) or (new_board[row][col] != EMPTY):
        raise Exception("Invalid Action")
    

    curr_player = player(board)
    new_board[row][col] = curr_player
    
    return new_board
    
    

def winner(board):
    """
    Returns the winner of the game, if there is one.
    """

    for row in range(3):
        if board[row][0] == board[row][1] == board[row][2] and board[row][0] != EMPTY:
            return board[row][0]
        
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] and board[0][col] != EMPTY:
            return board[0][col]
        
    if board[0][0] == board[1][1] == board[2][2] and board[0][0] != EMPTY:
        return board[0][0]
    
    if board[0][2] == board[1][1] == board[2][0] and board[0][2] != EMPTY:
        return board[0][2]
    
    return None
   
       

def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    if winner(board):
        return True
    else:
        for row in range(3):
            for col in range(3):
                if board[row][col] == EMPTY:
                    return False

    return True
    


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    if winner(board) == X:
        return 1
    elif winner(board) == O:
        return -1
    else:
        return 0



def minimax(board):
    """
    Returns the optimal action for the current player on the board.
    """
    if terminal(board):
        return None
    
    if player(board) == X:
        best_val = float("-inf")
        best_action = None
        for action in actions(board):
            value = minValue(result(board,action))
            if value > best_val:
                best_val = value
                best_action = action
        return best_action
    
    elif player(board) == O:
        best_val = float("inf")
        best_action = None
        for action in actions(board):
            value = maxValue(result(board,action))
            if value < best_val:
                best_val = value
                best_action = action
    return best_action
        
    

def maxValue(board):
    if terminal(board):
        return utility(board)
    
    v = float("-inf")

    for action in actions(board):
        v = max(v, minValue(result(board,action)))
    
    return v



def minValue(board):
    if terminal(board):
        return utility(board)
    
    v = float("inf")

    for action in actions(board):
        v = min(v, maxValue(result(board,action)))
    
    return v