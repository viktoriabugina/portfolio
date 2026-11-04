<?php
/**
 * Title: Hero with roast date
 * Slug: lumo/hero
 * Categories: lumo, banner
 * Description: Headline, two actions, three facts and a photo with a roast-date stamp.
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0"}}}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60","top":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center">
		<!-- wp:column {"verticalAlignment":"center","width":"52%","className":"lumo-intro"} -->
		<div class="wp-block-column is-vertically-aligned-center lumo-intro" style="flex-basis:52%">
			<!-- wp:paragraph {"className":"lumo-eyebrow"} -->
			<p class="lumo-eyebrow">Small-batch roastery · Lisbon</p>
			<!-- /wp:paragraph -->
			<!-- wp:heading {"level":1,"className":"lumo-split"} -->
			<h1 class="wp-block-heading lumo-split">Roasted on Tuesday. In your cup by Friday.</h1>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"textColor":"muted","fontSize":"large","style":{"typography":{"lineHeight":"1.55"}}} -->
			<p class="has-muted-color has-text-color has-large-font-size" style="line-height:1.55">Three seasonal coffees a week, bought directly from the farms that grow them and roasted light enough to taste where they come from.</p>
			<!-- /wp:paragraph -->
			<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
			<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
				<!-- wp:button -->
				<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#plans">Start a subscription</a></div>
				<!-- /wp:button -->
				<!-- wp:button {"className":"is-style-quiet"} -->
				<div class="wp-block-button is-style-quiet"><a class="wp-block-button__link wp-element-button" href="/roasts/">This week’s roasts</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
			<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|50","margin":{"top":"var:preset|spacing|50"},"padding":{"top":"var:preset|spacing|40"}},"border":{"top":{"color":"var:preset|color|line","width":"1px","style":"solid"}}}} -->
			<div class="wp-block-group" style="border-top-color:var(--wp--preset--color--line);border-top-style:solid;border-top-width:1px;margin-top:var(--wp--preset--spacing--50);padding-top:var(--wp--preset--spacing--40)">
				<!-- wp:paragraph {"fontSize":"small","style":{"typography":{"lineHeight":"1.4"}}} -->
				<p class="has-small-font-size" style="line-height:1.4"><strong style="font-family:var(--wp--preset--font-family--display);font-size:1.5rem;font-weight:600">48 h</strong><br>from roaster to courier</p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph {"fontSize":"small","style":{"typography":{"lineHeight":"1.4"}}} -->
				<p class="has-small-font-size" style="line-height:1.4"><strong style="font-family:var(--wp--preset--font-family--display);font-size:1.5rem;font-weight:600">12 farms</strong><br>we buy from directly</p>
				<!-- /wp:paragraph -->
				<!-- wp:paragraph {"fontSize":"small","style":{"typography":{"lineHeight":"1.4"}}} -->
				<p class="has-small-font-size" style="line-height:1.4"><strong style="font-family:var(--wp--preset--font-family--display);font-size:1.5rem;font-weight:600">Free</strong><br>shipping on subscriptions</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"verticalAlignment":"center","className":"lumo-hero-media"} -->
		<div class="wp-block-column is-vertically-aligned-center lumo-hero-media">
			<!-- wp:image {"aspectRatio":"10/9","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"lumo-parallax","style":{"border":{"radius":"24px"}}} -->
			<figure class="wp-block-image size-full has-custom-border lumo-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/hero.png' ) ); ?>" alt="A bag of Lumo coffee next to a filled cup and a scoop of roasted beans on a linen table" style="border-radius:24px;aspect-ratio:10/9;object-fit:cover" width="1200" height="1080"/></figure>
			<!-- /wp:image -->
			<!-- wp:paragraph {"className":"lumo-stamp"} -->
			<p class="lumo-stamp"><span>Roasted</span><strong>27·10</strong><span>Batch 214</span></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
