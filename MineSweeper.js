function mineSweeper(w, h, m) {
	if (h < 9) {
		h = 9;
	}
	if (w < 9) {
		w = 9;
	}
	var tab = '<tr><td class=\'score\' colspan=' + w + '><span class=\'info\'><span class=\'flags\'>0</span><span class=\'smiley\'>:|</span><span class=\'mines\'>0</span></span></td></tr><tr><td colspan=' + w + ' class=time>00:00:00</td></tr>';
	for (var y = 0; ++y <= h;) {
		tab += '<tr>';
		for (var x = 0; ++x <= w;) {
			tab += '<td class=\'x' + x + 'y' + y + ' block hide\'><span></span></td>';
		}
		tab += '</tr>';
	}
	$('.minefield').css({
		width: (w + 2) * 20,
		height: (h + 2) * 20
	}).append(tab);
	$('.block').bind("contextmenu", function(e) {
		e.preventDefault();
	});
	$('.block').mouseup(function(e) {
		$('.smiley').text(':)');
		switch (e.which) {
		case 1:
			var XY = getXY($(this));
			if ($('.mine').length == 0) {
				time = Math.round(new Date().getTime() / 1000);
				timer = window.setInterval(function(){
					var ntime = Math.round(new Date().getTime() / 1000);
					seconds = ntime - time;
					hours = Math.floor(seconds / 3600);
					seconds = seconds % 3600;
					minutes = Math.floor(seconds / 60);
					seconds = seconds % 60;
					$('.time').text((hours < 10 ? '0'+hours : hours)+':'+(minutes < 10 ? '0'+minutes : minutes)+':'+(seconds < 10 ? '0'+seconds : seconds));
				},1000);
				placeMines(16, 20, m,XY[0], XY[1]);
			}
			if ($(this).hasClass('hide')) {
				$.each($('.block'), function() {
					$(this).children('span').text((blockNumber($(this)) == 0 ? '' : blockNumber($(this))));
				});
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
		$('.smiley').text(':O');
	});
	$('.block').dblclick(function() {
		if (blockNumber($(this)) <= nearFlags($(this))) {
			showBlocks($(this));
		}
		getScore();
	});
	
	$('.block span').dblclick(function() {
		if (blockNumber($(this).parent()) <= nearFlags($(this).parent())) {
			showBlocks($(this).parent());
		}
		getScore();
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
			var qy = ob.attr('class').split(' ')[0].split('y');
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
		return $('.x' + X + 'y' + Y);
	}
	
	function placeMines(w, h, m, x1, y1) {
		while ($('.mine').length < m) {
			var xa = Math.round(Math.random() * w);
			var ya = Math.round(Math.random() * h);
			if (bl(xa, ya).hasClass('mine') == false && xa != x1 && ya != y1) {
				bl(xa, ya).addClass('mine');
			}
		}
	}
	
	function reveal(block) {
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
			block.children('span').text('');
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
	}
	function getScore() {
		var flags = $('.flagged').length;
		var mines = $('.mine').length;
		var hidden = $('.hide').length;
		var flaggedmines = $('.flagged.mine').length;
		if (flaggedmines == mines && flags == mines) {
			$('.flags').text(mines);
			winGame();
		}
		if (hidden == mines) {
			$('.flags').text(mines);
			winGame();
		}
		$('.flags').text(flags);
		$('.mines').text(mines);
	}
	function winGame() {
		window.clearInterval(timer);
		$('.smiley').txt('8)');
		$('.mine').addClass('flagged');
		$('.block').removeClass('hide');
		$('.flags').text($('.mines').text());
	}
	function loseGame() {
		window.clearInterval(timer);
		$.each($('.block'), function() {
			$(this).removeClass('hide');
		});
		$('.smiley').text(':\'(');
	}

}