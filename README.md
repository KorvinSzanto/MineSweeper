jQuery MineSweeper
==================
This was originally created to experiment with different methods of mine population, I wanted to find the best method for several scenarios:
1. Easiest start
2. Hardest start
3. Most efficient start
4. Most 'Artsy' start

The function that handles population is `placeMines()`:

  	placeMines = function(w, h, m, x1, y1) {
			while ($('.mine').length < m) {
				var xa = Math.round(Math.random() * w);
				var ya = Math.round(Math.random() * h);
				if (bl(xa, ya).hasClass('mine') == false && xa+','+ya != x1+','+y1) {
					bl(xa, ya).addClass('mine');
				}
			}
		}