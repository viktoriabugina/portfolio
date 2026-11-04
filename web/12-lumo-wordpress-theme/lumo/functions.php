<?php
/**
 * Lumo theme functions.
 *
 * @package Lumo
 */

defined( 'ABSPATH' ) || exit;

/**
 * Theme setup: editor styles and supports.
 */
function lumo_setup() {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/lumo.css' );
	add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'lumo_setup' );

/**
 * Front-end styles and the small reveal script.
 */
function lumo_assets() {
	$version = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'lumo', get_theme_file_uri( 'assets/css/lumo.css' ), array(), $version );
	wp_enqueue_script(
		'lumo-app',
		get_theme_file_uri( 'assets/js/lumo.js' ),
		array(),
		$version,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);
}
add_action( 'wp_enqueue_scripts', 'lumo_assets' );

/**
 * "Roast" post type: one entry per coffee on the current menu.
 */
function lumo_register_roasts() {
	register_post_type(
		'roast',
		array(
			'labels'        => array(
				'name'          => __( 'Roasts', 'lumo' ),
				'singular_name' => __( 'Roast', 'lumo' ),
				'add_new_item'  => __( 'Add new roast', 'lumo' ),
				'edit_item'     => __( 'Edit roast', 'lumo' ),
				'all_items'     => __( 'All roasts', 'lumo' ),
			),
			'public'        => true,
			'show_in_rest'  => true,
			'has_archive'   => 'roasts',
			'rewrite'       => array( 'slug' => 'roasts' ),
			'menu_icon'     => 'dashicons-coffee',
			'menu_position' => 5,
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'page-attributes' ),
		)
	);

	// Fields an editor fills in for every roast. Shown on the site through Block Bindings.
	$fields = array(
		'lumo_origin'  => __( 'Origin, e.g. Huila, Colombia', 'lumo' ),
		'lumo_process' => __( 'Process and altitude, e.g. Washed · 1,750 masl', 'lumo' ),
		'lumo_notes'   => __( 'Tasting notes', 'lumo' ),
		'lumo_roast'   => __( 'Roast level', 'lumo' ),
		'lumo_price'   => __( 'Price and bag size', 'lumo' ),
	);
	foreach ( $fields as $key => $label ) {
		register_post_meta(
			'roast',
			$key,
			array(
				'type'              => 'string',
				'description'       => $label,
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'lumo_register_roasts' );

/**
 * Pattern category and block styles.
 */
function lumo_register_block_extras() {
	register_block_pattern_category( 'lumo', array( 'label' => __( 'Lumo', 'lumo' ) ) );

	register_block_style(
		'core/group',
		array(
			'name'  => 'card',
			'label' => __( 'Card', 'lumo' ),
		)
	);
	register_block_style(
		'core/button',
		array(
			'name'  => 'quiet',
			'label' => __( 'Quiet', 'lumo' ),
		)
	);
}
add_action( 'init', 'lumo_register_block_extras' );

/**
 * Hide reveal blocks from the first paint (no flash), with a safety net:
 * if the reveal script has not run after 3 seconds, show everything.
 */
function lumo_reveal_head_flag() {
	?>
	<script>
	(function(d){if(!('IntersectionObserver' in window))return;d.documentElement.classList.add('lumo-js');setTimeout(function(){if(!window.lumoRevealReady){d.documentElement.classList.remove('lumo-js');}},3000);})(document);
	</script>
	<?php
}
add_action( 'wp_head', 'lumo_reveal_head_flag', 1 );
