import React from 'react';
import { Tabs, Tab, Carousel } from 'react-bootstrap';
import FadeIn from '../../Animations/fade-in';

const Pawn = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>Pawn</h5>
            <p> Pawns move one square forward in a straight line. They cannot move horizontally, diagonally or backwards.</p>
    
            <p>
              An exception to this is if a pawn is yet to be moved during the game. 
              If a pawn has not yet moved, it may be moved two squares forward as a single move. 
              Both squares must be empty. The player can also choose to move the piece a single square.
            </p>
    
            <p>
              The only time a pawn may move diagonally is when capturing an opponent’s piece. 
              Pawns may capture an opponent’s piece on either of the diagonal spaces to the left or 
              right ahead of the piece. As part of capturing the piece, the pawn will move diagonally to 
              replace the captured piece. A pawn cannot capture an adjacent piece on any other square, or 
              move diagonally without capturing.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Rook = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>Rook</h5>
            <p> 
            The rook, sometimes called the castle, can move any number of squares horizontally 
            along its current row (rank) or column (file). It cannot pass through pieces of the 
            same colour, and can capture pieces of the opposite colour by moving onto an occupied space. 
            It cannot move diagonally for any reason. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Knight = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>Knight</h5>
  
            <p>
              Knights are the only chess piece that may be moved ‘through’ other pieces by ‘jumping’ over them. It 
              captures pieces as normal by landing on a space occupied by a piece of the opposite colour and cannot move 
              to a square occupied by a piece of the same colour, but may move over pieces of either colour during its move.
            </p>
  
            <p>
              Knights move in a fixed ‘L’ pattern: two squares forward, backward, left or right, then one square 
              horizontally or vertically, or vice versa - one square forward, backward, left or right, followed 
              by two squares horizontally or vertically to complete the ‘L’ shape.
            </p>
  
            <p>
              This means that the knight can always move to the closest square that is not on its current row 
              (rank), column (file) or directly adjacent diagonally.
            </p>
  
            <p>
              The knight must move the full distance - it cannot move just two squares in a straight line 
              without also moving one to the side, for instance. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Bishop = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>Bishop</h5>
            <p>
              The bishop can move any number of squares diagonally - this means it 
              always moves along the diagonal line of squares matching the current colour of its square. 
              This means that each player begins the game with one bishop that can move on each colour. 
              A bishop cannot move horizontally or vertically for any reason. It cannot move through pieces 
              of the same colour, and captures a piece of the opposite colour by moving onto its square.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Queen = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>Queen</h5>
            <p>
              The queen may move any number of squares horizontally, vertically or diagonally. These 
              movements must be made in a single straight line during a single turn. (In other words, 
              you can’t move three squares diagonally, followed by three spaces vertically.) The queen
              cannot move through pieces of the same colour, and captures a piece of the opposite colour
              by moving onto its square. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const King = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <img src="/placeholder.png" alt=""></img>
          </div>
          <div className="col">
            <h5>King</h5>
            <p>  
              The king moves a single space horizontally, vertically or diagonally. 
              The king cannot move into a space that would grant a check or checkmate to the opponent player.
            </p>
  
            <p>
              As an exception to all other chess pieces, the king is never captured - a 
              player loses the match when the king is placed into checkmate, which would lead to an unavoidable 
              capture on the opponent’s next turn.
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Promotion = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <Carousel interval={null} wrap={false}>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col">
            <h5>Promotion</h5>
            <p>  
              If a pawn reaches the opposite edge of the board - the farthest row (rank) from the controlling
              player - it is promoted to another piece: a rook, knight, bishop or queen. The new piece replaces 
              the pawn on its current square, and follows the movement rules for the respective piece.
            </p>
  
            <p>
              While most casual players use captured pieces to represent promoted pieces, a pawn can legally 
              be promoted to any piece regardless of whether it has been captured. For example, a player may 
              have multiple queens as the result of promoting pawns, or multiple bishops able to move along 
              diagonal lines of the same colour depending on the square on which the pawn was promoted.
            </p>
  
            <p>
              There is no limit to the number of pawns that can be promoted. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Enpassant = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <Carousel interval={null} wrap={false}>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col">
            <h5>En Passant</h5>
            <p>  
              En passant - French for ‘in passing’ - is one of the most famous moves in chess. 
              En passant occurs when a pawn moves two squares forward as the result of its optional starting move.
            </p>
  
            <p>
              If an opponent’s pawn would have been able to legally capture the moving pawn had 
              it only moved one square instead of two, the opponent can declare en passant on their 
              next turn and move their pawn diagonally onto the square that the pawn passed through - 
              capturing the pawn as if it had only moved one square.
            </p>
  
            <p>
              En passant must be declared and made as the opponent’s next turn to be legal - otherwise, 
              the player with the chance to capture the pawn loses the opportunity. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Castling = () => {
  return (
    <FadeIn>
      <div className="card border-top-0">
        <div className="row m-3">
          <div className="col d-flex align-items-center justify-content-center">
            <Carousel interval={null} wrap={false}>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
              <Carousel.Item>
                <img src="/placeholder.png" alt="Third slide"/>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="col">
            <h5>Castling</h5>
            <p>  
            Castling is perhaps the most complicated basic rule in chess, and a rule that many 
            beginners often overlook as a result.
            </p>
  
            <p>
              Castling is permitted when a player’s king piece and a rook have not yet moved 
              during the game. Castling can be performed with either rook, as long as they haven’t 
              moved - in other words, they are still in their starting corners on the edge closest 
              to the controlling player.
            </p>
  
            <p>
              Castling involves a player moving the king piece two squares towards the rook with 
              which they are castling, before moving the rook to the square that the king moved 
              ‘through’. This effectively puts the rook adjacent on the other side of the king, 
              while the king moves two squares towards the space in which the rook started the 
              game. Regardless of whether castling is performed with the rook closer to the king 
              (kingside) or one square further away (queenside), the king only ever moves two spaces.
            </p>
  
            <p>
              The king cannot be used in a castling manoeuvre if it is currently in check, but a
              rook can be used in castling even if it is under threat from an opponent’s piece - 
              in other words, if it could be captured on the opponent’s next turn, or on any of the 
              squares it passes through while performing the move.
            </p>
  
            <p>
              As usual, castling cannot be used to move the king if it would put the king into 
              check. Castling also cannot be used if there are any pieces between the king and 
              the rook - the squares between must be clear. 
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  )
}

const Tutorial = () => {
  return (
    <div className="container mt-3 mb-5">
      <h1 className="text-center">Your Guide to Beginning Chess</h1>
      <hr />

      <div className="row">
        <div className="col">
          <h3>Setting Up The Board</h3>
          <p>
          Chess is played by two players on a chess board measuring eight-by-eight squares. 
          The 64 squares alternate between light and dark colours - traditionally, black and white. 
          When properly set up, a white square should be the rightmost square along the edge closest to each player. 
          </p>
    
          <p>
          Players’ pieces are set up in the two horizontal rows (known as ranks) closest to each player. 
          The second rank - ie. the second row from the player’s perspective - consists of a line of eight pawns, 
          each placed on a single square. 
          </p>
    
          <p>
          The closer rank is nearly symmetrical, with rooks (also known as castles) placed on the two leftmost and 
          rightmost corner squares, followed by knights on the inside space next to them, then bishops. 
          </p>
    
          <p>
          The two central squares of the rank are occupied by the king and queen. The queen is 
          placed on the square matching her colour (for example, the black queen on the black square), with the king 
          occupying the remaining square of the opposite colour. This means that the king and queen of each colour face 
          each other, making the correct setup symmetrical between the two players.
          </p>
    
          <p>
          The white player takes the first move, with players alternating single turns until a player is defeated 
          via checkmate or resigns. A draw can also be agreed. If playing with an optional timer, as in tournaments, 
          the first player to run out of time forfeits the game. 
          </p>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <img src="/placeholder.png" alt=""></img>
        </div>
      </div>
      
      <hr />
      <h3>Rules of the Pieces</h3>
      <div className="">
        <Tabs defaultActiveKey="pawn">
          <Tab eventKey="pawn" title="Pawn">
            <Pawn />
          </Tab>
          <Tab eventKey="rook" title="Rook">
            <Rook />
          </Tab>
          <Tab eventKey="knight" title="Knight">
            <Knight />
          </Tab>
          <Tab eventKey="bishop" title="Bishop">
            <Bishop />
          </Tab>
          <Tab eventKey="queen" title="Queen">
            <Queen />
          </Tab>
          <Tab eventKey="king" title="King">
            <King />
          </Tab>
        </Tabs>
      </div>

      <hr />
      <div className="row">
        <div className="col">
          <h3>Check, Checkmate, or Stalemate</h3>
          <p>
          Chess is played by two players on a chess board measuring eight-by-eight squares. 
          The 64 squares alternate between light and dark colours - traditionally, black and white. 
          When properly set up, a white square should be the rightmost square along the edge closest to each player. 
          </p>
    
          <p>
          Players’ pieces are set up in the two horizontal rows (known as ranks) closest to each player. 
          The second rank - ie. the second row from the player’s perspective - consists of a line of eight pawns, 
          each placed on a single square. 
          </p>
    
          <p>
          The closer rank is nearly symmetrical, with rooks (also known as castles) placed on the two leftmost and 
          rightmost corner squares, followed by knights on the inside space next to them, then bishops. 
          </p>
    
          <p>
          The two central squares of the rank are occupied by the king and queen. The queen is 
          placed on the square matching her colour (for example, the black queen on the black square), with the king 
          occupying the remaining square of the opposite colour. This means that the king and queen of each colour face 
          each other, making the correct setup symmetrical between the two players.
          </p>
    
          <p>
          The white player takes the first move, with players alternating single turns until a player is defeated 
          via checkmate or resigns. A draw can also be agreed. If playing with an optional timer, as in tournaments, 
          the first player to run out of time forfeits the game. 
          </p>
        </div>
        <div className="col d-flex align-items-center justify-content-center">
          <img src="/placeholder.png" alt=""></img>
        </div>
      </div>

      <hr />
      <h3>Advanced Moves</h3>
      <div className="">
        <Tabs defaultActiveKey="promotion">
          <Tab eventKey="promotion" title="Promotion">
            <Promotion />
          </Tab>
          <Tab eventKey="enpassant" title="En Passant">
            <Enpassant />
          </Tab>
          <Tab eventKey="castling" title="Castling">
            <Castling />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Tutorial;