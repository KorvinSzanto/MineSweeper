(function($){
	mineSweeper = function(w, h, m) {
		h=(h<9?9:h);
		w=(w<9?9:w);
		m=(m>w*h - 1?w*h - 1:m);
		var tab = '<tr><td class=\'score\' colspan=' + w + '><span class=\'info\'><span class=\'flags\'>0</span><span class=\'smiley\'>:|</span><span class=\'mines\'>'+m+'</span></span></td></tr><tr><td colspan=' + w + ' class=time>00:00:00</td></tr>';
		for (var y = 0; ++y <= h;) {
			tab += '<tr>';
			for (var x = 0; ++x <= w;) {
				tab += '<td id=\'x' + x + 'y' + y + '\' class=\'block hide\' title=\'n\'><div>&nbsp;</div></td>';
			}
			tab += '</tr>';
		}
		$('.minefield').css({width: (w + 2) * 20,height: (h + 2) * 20}).append(tab).attr('cellpadding',0).attr('cellspacing',0);
		$('.block','.minefield').bind("contextmenu", function(e) {
			e.preventDefault();
		});
		$('.block','.minefield').mouseup(function(e) {
			$('.smiley','.minefield').text(':)');
			switch (e.which) {
			case 1:
				var XY = getXY($(this));
				if ($('.mine','.block').length == 0) {
					time = Math.round(new Date().getTime() / 1000);
					timer = window.setInterval(function(){
						var ntime = Math.round(new Date().getTime() / 1000);
						seconds = ntime - time;
						hours = Math.floor(seconds / 3600);
						seconds = seconds % 3600;
						minutes = Math.floor(seconds / 60);
						seconds = seconds % 60;
						$('.time','.minefield').text((hours < 10 ? '0'+hours : hours)+':'+(minutes < 10 ? '0'+minutes : minutes)+':'+(seconds < 10 ? '0'+seconds : seconds));
					},1000);
					placeMines(w, h, m,XY[0], XY[1]);
					$.each($('.block','.minefield'),function(){
						num = blockNumber($(this));
						$(this).attr('title',num).children('div').text((num == 0 ? '' : num));
					});
				}
				if ($(this).hasClass('hide')) {
					reveal($(this));
				}
				break;
			case 3:
				e.preventDefault();
				if ($(this).hasClass('flagged')) {
					$(this).removeClass('flagged');
				}
				else if ($(this).hasClass('hide')) {
					$(this).addClass('flagged');
				}
				getScore();
				return false;
				break;
			}
			getScore();
		}).mousedown(function(e) {
			$('.smiley','.minefield').text(':O');
		});
		$('.block','.minefield').dblclick(function() {
			if (blockNumber($(this)) <= nearFlags($(this))) {
				showBlocks($(this));
			}
			getScore();
		}); 
		nearFlags = function(block) {
			var thex = getXY(block)[0];
			var they = getXY(block)[1];
			if (isFlag(thex, they) === false) {
				--they;
				--thex;
				var nearflags = 0;
				for (mody = 0; mody < 3; mody++) {
					for (modx = 0; modx < 3; modx++) {
						var newx = thex + modx;
						var newy = they + mody;
						if (isFlag(newx, newy)) {
							++nearflags;
						}
					}
				}
				return nearflags;
			}
			else {
				return '0';
			}
		}
		getXY = function(ob) {
			if (typeof(ob) == 'object') {
				var qy = ob.attr('id').split(' ')[0].split('y');
				var q = [];
				q[0] = qy[0].split('x')[1];
				q[1] = qy[1];
				return q;
			}
		}
		isMine = function(k, u) {
			return bl(k, u).hasClass('mine');
		}
		isFlag = function(k, u) {
			return bl(k, u).hasClass('flagged');
		}
		blockNumber = function(block) {
			if (block.attr('title')!='n') { return block.attr('title'); }
			var thex = getXY(block)[0];
			var they = getXY(block)[1];
			if (isMine(thex, they) === false) {
				--they;
				--thex;
				var nearmines = 0;
				for (mody = 0; mody < 3; mody++) {
					for (modx = 0; modx < 3; modx++) {
						var newx = thex + modx;
						var newy = they + mody;
						if (isMine(newx, newy)) {
							++nearmines;
						}
					}
				}
				return nearmines;
			}
			else {
				return 'x';
			}
		}
		bl = function(X, Y) {
			return $('#x' + X + 'y' + Y);
		}
		placeMines = function(w, h, m, x1, y1) {
			if ($('td.mine').length < m){
				var mns = $("td.block:[id!=x"+x1+"y"+y1+"]");
				mns = mns.sort(function(){ 
					return Math.round(Math.random())-0.5
				}).slice(0,m);
				mns.addClass('mine');
			}
		}
		reveal = function(block) {
			if (!block.hasClass('hide')) {
				return;
			}
			block.removeClass('hide').removeClass('flagged');
			var thex = getXY(block)[0];
			var they = getXY(block)[1];
			if (isMine(thex, they)) {
				loseGame();
			}
			if (blockNumber(block) == '0') {
				block.children('div').text('');
				--they;
				--thex;
				var nearmines = 0;
				var mody, modx;
				for (mody = 0; mody < 3; mody++) {
					for (modx = 0; modx < 3; modx++) {
						var newx = thex + modx;
						var newy = they + mody;
						reveal(bl(newx, newy));
					}
				}
			}
		}
		showBlocks = function(block) {
			var thex = getXY(block)[0];
			var they = getXY(block)[1];
			--they;
			--thex;
			var nearmines = 0;
			var mody, modx;
			for (mody = 0; mody < 3; mody++) {
				for (modx = 0; modx < 3; modx++) {
					var newx = thex + modx;
					var newy = they + mody;
					if (!isFlag(newx, newy)) {
						reveal(bl(newx, newy));
					}
				}
			}
		}
		getScore = function() {
			var flags = $('.flagged').length;
			var mines = $('.mine').length;
			var hidden = $('.hide').length;
			var flaggedmines = $('.flagged.mine').length;
			if (flaggedmines == mines && flags == mines) {
				$('.flags','.minefield').text(mines);
				winGame();
			}
			if (hidden == mines) {
				$('.flags','.minefield').text(mines);
				$('.hide').addClass('flagged');
				winGame();
			}
			$('.flags','.minefield').text(flags);
			$('.mines','.minefield').text(mines);
		}
		winGame = function() {
			window.clearInterval(timer);
			$('.smiley','.minefield').text('8)');
			$('.mine','.block').addClass('flagged');
			$('.block','.minefield').removeClass('hide');
			$('.flags','.minefield').text($('.mines','.minefield').text());
		}
		loseGame = function() {
			window.clearInterval(timer);
			$('.block','.minefield').removeClass('hide');
			$('.smiley','.minefield').text(':\'(');
		}
	}
})(jQuery);