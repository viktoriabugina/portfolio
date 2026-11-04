<?php
/**
 * Title: Visit the roastery
 * Slug: lumo/visit
 * Categories: lumo, call-to-action
 * Description: Dark band with an image, address, opening hours and a cupping invitation.
 */
?>
<!-- wp:group {"align":"full","backgroundColor":"ink","textColor":"crema","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0"}},"elements":{"link":{"color":{"text":"var:preset|color|surface"}}}}} -->
<div class="wp-block-group alignfull has-crema-color has-ink-background-color has-text-color has-background has-link-color" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|60","top":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center">
		<!-- wp:column {"verticalAlignment":"center","className":"lumo-reveal"} -->
		<div class="wp-block-column is-vertically-aligned-center lumo-reveal">
			<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","linkDestination":"none","className":"lumo-parallax","style":{"border":{"radius":"24px"}}} -->
			<figure class="wp-block-image size-full has-custom-border lumo-parallax"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/roastery.png' ) ); ?>" alt="The Lumo roastery front with a drum roaster visible through the window" style="border-radius:24px;aspect-ratio:4/3;object-fit:cover" width="1200" height="900"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"verticalAlignment":"center","className":"lumo-reveal"} -->
		<div class="wp-block-column is-vertically-aligned-center lumo-reveal">
			<!-- wp:paragraph {"className":"lumo-eyebrow"} -->
			<p class="lumo-eyebrow">The roastery</p>
			<!-- /wp:paragraph -->
			<!-- wp:heading {"textColor":"surface"} -->
			<h2 class="wp-block-heading has-surface-color has-text-color">Free cupping every Saturday at 11</h2>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"fontSize":"large","style":{"typography":{"lineHeight":"1.55"}}} -->
			<p class="has-large-font-size" style="line-height:1.55">Taste the week’s roasts side by side with the people who roasted them. Six seats, no experience needed.</p>
			<!-- /wp:paragraph -->
			<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.9"}}} -->
			<p style="line-height:1.9"><strong>Rua das Gaivotas 18, Lisbon</strong><br>Wednesday to Sunday · 9:00–17:00</p>
			<!-- /wp:paragraph -->
			<!-- wp:buttons -->
			<div class="wp-block-buttons">
				<!-- wp:button {"backgroundColor":"crema","textColor":"ink"} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-ink-color has-crema-background-color has-text-color has-background wp-element-button" href="/visit/">Book a cupping seat</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
