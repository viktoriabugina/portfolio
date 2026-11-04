<?php require_once ABSPATH.'wp-load.php';

// Fills the Lumo demo site: pages, roasts, brew guides. Run once: php seed.php
require_once ABSPATH.'wp-admin/includes/file.php';
require_once ABSPATH.'wp-admin/includes/media.php';
require_once ABSPATH.'wp-admin/includes/image.php';


update_option('blogname', 'Lumo Coffee Roasters');
update_option('blogdescription', 'Small-batch roastery in Lisbon');
update_option('permalink_structure', '/%postname%/');
update_option('timezone_string', 'Europe/Lisbon');
register_post_type('roast', ['public'=>true,'has_archive'=>'roasts','rewrite'=>['slug'=>'roasts']]);

$img = get_theme_root().'/'.get_option('stylesheet').'/assets/images/';
function lumo_import($file, $title) {
	$tmp = wp_tempnam($file);
	copy($file, $tmp);
	$id = media_handle_sideload(['name'=>basename($file),'tmp_name'=>$tmp], 0, $title);
	if (!is_wp_error($id)) update_post_meta($id, '_wp_attachment_image_alt', $title);
	return is_wp_error($id) ? 0 : $id;
}
$bag = [lumo_import($img.'bag-1.jpg','A Lumo coffee bag, light roast'), lumo_import($img.'bag-2.jpg','A Lumo coffee bag, medium roast'), lumo_import($img.'bag-3.jpg','A Lumo coffee bag, espresso roast')];

$roasts = [
 ['Huila Bourbon','Huila, Colombia','Washed · 1,750 masl','Red apple, panela, orange zest','Light','€14 · 250 g',$bag[0]],
 ['Sidama Guji','Guji, Ethiopia','Natural · 2,100 masl','Blueberry jam, jasmine, honey','Light','€16 · 250 g',$bag[1]],
 ['Cerrado Dulce','Minas Gerais, Brazil','Pulped natural · 1,100 masl','Hazelnut, milk chocolate, caramel','Medium','€12 · 250 g',$bag[2]],
 ['Kirinyaga AA','Kirinyaga, Kenya','Washed · 1,800 masl','Blackcurrant, grapefruit, brown sugar','Light','€17 · 250 g',$bag[0]],
 ['Antigua Reserva','Antigua, Guatemala','Washed · 1,650 masl','Cocoa nib, orange, toasted almond','Medium','€13 · 250 g',$bag[1]],
 ['House Espresso','Brazil + Ethiopia blend','Natural · 1,100–2,100 masl','Dark chocolate, cherry, round body','Espresso','€13 · 250 g',$bag[2]],
];
foreach ($roasts as $i => $r) {
	$id = wp_insert_post(['post_type'=>'roast','post_status'=>'publish','post_title'=>$r[0],'menu_order'=>$i,
		'post_excerpt'=>"{$r[3]}. {$r[1]}.",
		'post_content'=>"<!-- wp:paragraph --><p>{$r[0]} comes from {$r[1]}, grown at altitude and processed as {$r[4]}-roast friendly lots. Expect {$r[3]}. We roast it on Tuesdays and ship it within 48 hours, so it reaches you at its best.</p><!-- /wp:paragraph -->"]);
	foreach (['lumo_origin'=>$r[1],'lumo_process'=>$r[2],'lumo_notes'=>$r[3],'lumo_roast'=>$r[4],'lumo_price'=>$r[5]] as $k=>$v) update_post_meta($id,$k,$v);
	if ($r[6]) set_post_thumbnail($id, $r[6]);
}

$guides = [
 ['v60','guide-v60.jpg','How to brew a clean, sweet V60','A simple recipe for a bright filter cup, with the numbers that matter.','15 g coffee','250 g water','94 °C','2:45 min',[
   'Rinse the paper filter with hot water, then discard the water.',
   'Add 15 g of medium-fine coffee and pour 40 g of water. Wait 40 seconds.',
   'Pour slowly in circles up to 150 g, then up to 250 g by 1:30.',
   'Let it drain. The bed should be flat and finish near 2:45.']],
 ['aeropress','guide-aeropress.jpg','AeroPress: a forgiving morning cup','Short, quick and hard to get wrong, even before you are fully awake.','14 g coffee','220 g water','92 °C','2:00 min',[
   'Place a wet filter in the cap and set the AeroPress on your mug.',
   'Add 14 g of coffee, pour 220 g of water and stir three times.',
   'Insert the plunger, wait until 1:30, then press gently for 30 seconds.']],
 ['french-press','guide-french-press.jpg','French press without the sludge','Keep the body, lose the bitterness: a longer steep and a patient pour.','30 g coffee','500 g water','95 °C','4:00 min',[
   'Add 30 g of coarse coffee and pour 500 g of water, wetting all the grounds.',
   'Leave it for 4 minutes without stirring, then break the crust with a spoon.',
   'Skim the foam, wait 5 more minutes, then pour slowly and stop before the last sip.']],
];
$d = strtotime('-1 week');
foreach ($guides as $i=>$g) {
	$att = lumo_import($img.$g[1], $g[2]);
	$steps = ''; foreach ($g[9] as $s) $steps .= "<!-- wp:list-item --><li>$s</li><!-- /wp:list-item -->";
	$content = "<!-- wp:paragraph --><p>{$g[3]}</p><!-- /wp:paragraph -->"
	 ."<!-- wp:table {\"className\":\"is-style-stripes\"} --><figure class=\"wp-block-table is-style-stripes\"><table><tbody><tr><td>Coffee</td><td>{$g[4]}</td></tr><tr><td>Water</td><td>{$g[5]}</td></tr><tr><td>Temperature</td><td>{$g[6]}</td></tr><tr><td>Total time</td><td>{$g[7]}</td></tr></tbody></table></figure><!-- /wp:table -->"
	 ."<!-- wp:heading {\"level\":2} --><h2 class=\"wp-block-heading\">Steps</h2><!-- /wp:heading -->"
	 ."<!-- wp:list {\"ordered\":true} --><ol class=\"wp-block-list\">$steps</ol><!-- /wp:list -->"
	 ."<!-- wp:quote --><blockquote class=\"wp-block-quote\"><p>If the cup tastes sharp, grind finer. If it tastes flat or bitter, grind coarser.</p></blockquote><!-- /wp:quote -->";
	$id = wp_insert_post(['post_type'=>'post','post_status'=>'publish','post_title'=>$g[2],'post_excerpt'=>$g[3],'post_content'=>$content,'post_date'=>date('Y-m-d H:i:s',$d - $i*86400*3)]);
	if ($att) set_post_thumbnail($id,$att);
}

$guidesPage = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>'Brew guides','post_name'=>'brew-guides','post_content'=>'']);
update_option('show_on_front','posts'); update_option('page_for_posts',$guidesPage);

$visit = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>'Visit','post_name'=>'visit',
	'post_content'=>'<!-- wp:pattern {"slug":"lumo/visit"} /-->']);
update_post_meta($visit,'_wp_page_template','page-wide');
flush_rewrite_rules();
echo "seeded: ".count($roasts)." roasts, ".count($guides)." guides\n";

foreach (get_posts(['post_type'=>['post','page'],'name'=>'hello-world','numberposts'=>1]) as $p) wp_delete_post($p->ID,true);
foreach (get_posts(['post_type'=>'page','name'=>'sample-page','numberposts'=>1]) as $p) wp_delete_post($p->ID,true);
flush_rewrite_rules();
