(function() {
  var Game15, Paper, Piece15, getRandom, test;

  getRandom = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  Paper = (function() {
    function Paper(sizeOfGame15) {
      this.paper = Snap(window.innerWidth, window.innerHeight);
      this.Game15 = new Game15(this.paper, sizeOfGame15);
      this._bindEvents();
    }

    Paper.prototype._bindEvents = function() {
      return window.addEventListener("resize", (function(_this) {
        return function() {
          return _this.paper.attr({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
      })(this));
    };

    return Paper;

  })();

  Game15 = (function() {
    function Game15(paper, cells) {
      var array, border, contSize, i, offset, padding, ref, results;
      this.animation = false;
      this.cells = cells;
      array = (function() {
        results = [];
        for (var i = 0, ref = this.cells * this.cells; 0 <= ref ? i < ref : i > ref; 0 <= ref ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this);
      this.emptyLoc = {
        x: 0,
        y: 0
      };
      this.area = paper.svg(0, 0, this.size = 500, this.size).addClass("game-15");
      this.c = this.size / 2;
      border = 6;
      padding = 6;
      offset = border + padding;
      contSize = this.size - 2 * offset;
      this.pieceSize = contSize / this.cells;
      this.container = this.area.svg(offset, offset, contSize, contSize).g();
      this.area.rect(border / 2, border / 2, this.size - border, this.size - border, 14, 14).attr({
        fill: 'transparent',
        strokeWidth: border,
        stroke: '#fff'
      }).addClass('border');
      this._createPieces(array);
    }

    Game15.prototype.pieces = [];

    Game15.prototype.emptyLoc = null;

    Game15.prototype.pieceClicked = function(piece) {
      var deltaX, deltaY, empty, nextDoor;
      empty = this.pieces[this.emptyLoc.x][this.emptyLoc.y];
      deltaX = Math.abs(this.emptyLoc.x - piece.loc.x);
      deltaY = Math.abs(this.emptyLoc.y - piece.loc.y);
      nextDoor = deltaX <= 1 && deltaY <= 1 && (deltaX + deltaY) === 1;
      if (!nextDoor) {
        return;
      }
      return this.movePiece(piece);
    };

    Game15.prototype.movePiece = function(piece) {
      var empty;
      empty = this.pieces[this.emptyLoc.y][this.emptyLoc.x];
      this.animation = true;
      piece.area.animate({
        transform: "t" + empty.pos.x + "," + empty.pos.y
      }, 200, (function(_this) {
        return function() {
          return _this.animation = false;
        };
      })(this));
      empty.area.animate({
        transform: "t" + piece.pos.x + "," + piece.pos.y
      }, 200, (function(_this) {
        return function() {
          return _this.animation = false;
        };
      })(this));
      return this.replacePieces(piece, empty);
    };

    Game15.prototype.replacePieces = function(piece, empty) {
      var emptyNewLoc, pieceNewLoc;
      this.pieces[piece.loc.y][piece.loc.x] = empty;
      this.pieces[empty.loc.y][empty.loc.x] = piece;
      pieceNewLoc = {
        x: empty.loc.x,
        y: empty.loc.y
      };
      emptyNewLoc = {
        x: piece.loc.x,
        y: piece.loc.y
      };
      empty.loc.x = this.emptyLoc.x = emptyNewLoc.x;
      empty.loc.y = this.emptyLoc.y = emptyNewLoc.y;
      piece.loc.x = pieceNewLoc.x;
      piece.loc.y = pieceNewLoc.y;
      empty.pos.x = piece.pos.x;
      return empty.pos.y = piece.pos.y;
    };

    Game15.prototype._addPiece = function(piece, x, y) {
      if (!this.pieces[y]) {
        this.pieces[y] = [];
      }
      return this.pieces[y][x] = piece;
    };

    Game15.prototype._createPieces = function(array) {
      var config, i, index, len, newPiece, piece, results, xIndex, yIndex;
      results = [];
      for (index = i = 0, len = array.length; i < len; index = ++i) {
        piece = array[index];
        yIndex = Math.floor(index / this.cells);
        xIndex = index - this.cells * yIndex;
        config = {
          index: piece,
          size: this.pieceSize,
          start: {
            x: this.pieceSize * xIndex,
            y: this.pieceSize * yIndex
          },
          loc: {
            x: xIndex,
            y: yIndex
          }
        };
        newPiece = new Piece15(this, this.container, config);
        results.push(this._addPiece(newPiece, xIndex, yIndex));
      }
      return results;
    };

    return Game15;

  })();

  Piece15 = (function() {
    function Piece15(game, context, config) {
      var border, empty, offset, padding, rectSize, text, textParams;
      this.game = game;
      this.size = config.size;
      this.loc = {
        x: config.loc.x,
        y: config.loc.y
      };
      this.pos = {
        x: config.start.x,
        y: config.start.y
      };
      if (config.index !== 0) {
        this.hint = config.index;
      } else {
        this.hint = '';
        empty = true;
      }
      this.area = context.g();
      this.area.addClass("piece-15");
      this.area.transform("t" + config.start.x + "," + config.start.y);
      if (empty) {
        this.area.addClass('empty');
      }
      this._bindEvents();
      this.container = this.area.g();
      border = 3;
      padding = 3;
      offset = border + padding;
      this.container.rect(border / 2 + padding, border / 2 + padding, rectSize = this.size - border - 2 * padding, rectSize, 8, 8).attr({
        fill: 'rgba(255,255,255,.3)',
        stroke: '#fff',
        strokeWidth: '3px'
      });
      text = this.container.text(rectSize / 2, rectSize / 2, this.hint).attr({
        fontSize: rectSize / 2.5
      }).addClass('hint');
      textParams = text.node.getBoundingClientRect();
      text.transform("t-" + (textParams.width / 2 - 4) + "," + (textParams.height / 2 - 3));
      console.log(text.node.getBoundingClientRect());
    }

    Piece15.prototype._bindEvents = function() {
      return this.area.click((function(_this) {
        return function() {
          var posArr, posString;
          posString = _this.area.transform().local.slice(1);
          if (!posString) {
            posString = '0,0';
          }
          posArr = posString.split(',');
          _this.pos = {
            x: posArr[0],
            y: posArr[1]
          };
          return _this.game.pieceClicked(_this);
        };
      })(this));
    };

    return Piece15;

  })();

  test = new Paper(5);

  console.log(test);

}).call(this);
