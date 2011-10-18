function mineSweeper(w, h, m) {
	h=(h<9?9:h);
	w=(w<9?9:w);
	m=(m>w*h - 1?w*h - 1:10);
	var tab = '<tr><td class=\'score\' colspan=' + w + '><span class=\'info\'><span class=\'flags\'>0</span><span class=\'smiley\'>:|</span><span class=\'mines\'>'+m+'</span></span></td></tr><tr><td colspan=' + w + ' class=time>00:00:00</td></tr>';
	for (var y = 0; ++y <= h;) {
		tab += '<tr>';
		for (var x = 0; ++x <= w;) {
			tab += '<td id=\'x' + x + 'y' + y + '\' class=\'block hide\' title=\'n\'><div></div></td>';
		}
		tab += '</tr>';
	}
	$('.minefield').css({width: (w + 2) * 20,height: (h + 2) * 20}).append(tab).attr('cellpadding',0).attr('cellspacing',0);
	$('.block','.minefield').bind("contextmenu", function(e) {
		e.preventDefault();
		return false;
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
					return false;
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
		return false;
	}).mousedown(function(e) {
		$('.smiley','.minefield').text(':O');
	});
	$('.block','.minefield').dblclick(function() {
		if (blockNumber($(this)) <= nearFlags($(this))) {
			showBlocks($(this));
		}
		getScore();
		return false;
	});
	
	$('div','.block').dblclick(function() {
		if (blockNumber($(this).parent()) <= nearFlags($(this).parent())) {
			showBlocks($(this).parent());
		}
		getScore();
		return false;
	});
	function nearFlags(block) {
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
	
	function getXY(ob) {
		if (typeof(ob) == 'object') {
			var qy = ob.attr('id').split(' ')[0].split('y');
			var q = [];
			q[0] = qy[0].split('x')[1];
			q[1] = qy[1];
			return q;
		}
	}
	
	function isMine(k, u) {
		return bl(k, u).hasClass('mine');
	}
	
	function isFlag(k, u) {
		return bl(k, u).hasClass('flagged');
	}
	
	function blockNumber(block) {
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
	
	function bl(X, Y) {
		return $('#x' + X + 'y' + Y);
	}
	
	function placeMines(w, h, m, x1, y1) {
		while ($('.mine').length < m) {
			var xa = Math.round(Math.random() * w);
			var ya = Math.round(Math.random() * h);
			if (bl(xa, ya).hasClass('mine') == false && xa+','+ya != x1+','+y1) {
				bl(xa, ya).addClass('mine');
			}
		}
    	return false; 
	}
	
	function reveal(block) {
		if (!block.hasClass('hide')) {
			return false;
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
		return false;
	}
	
	function showBlocks(block) {
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
		return false;
	}
	function getScore() {
		var flags = $('.flagged','.block').length;
		var mines = $('.mine','.block').length;
		var hidden = $('.hide','.block').length;
		var flaggedmines = $('.flagged.mine','.block').length;
		if (flaggedmines == mines && flags == mines) {
			$('.flags','.minefield').text(mines);
			winGame();
		}
		if (hidden == mines) {
			$('.flags','.minefield').text(mines);
			winGame();
		}
		$('.flags','.minefield').text(flags);
		$('.mines','.minefield').text(mines);
		return false;
	}
	function winGame() {
		window.clearInterval(timer);
		$('.smiley','.minefield').txt('8)');
		$('.mine','.block').addClass('flagged');
		$('.block','.minefield').removeClass('hide');
		$('.flags','.minefield').text($('.mines','.minefield').text());
		return false;
	}
	function loseGame() {
		window.clearInterval(timer);
		$('.block','.minefield').removeClass('hide');
		$('.smiley','.minefield').text(':\'(');
		return false;
	}
}