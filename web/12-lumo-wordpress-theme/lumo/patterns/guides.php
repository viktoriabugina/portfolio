<?php
/**
 * Title: Latest brew guides
 * Slug: lumo/guides
 * Categories: lumo, query
 * Description: The three newest posts from the Brew guides category.
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0"}}}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:group {"align":"wide","className":"lumo-reveal","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"},"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-group alignwide lumo-reveal" style="margin-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:group {"layout":{"type":"constrained","contentSize":"620px","justifyContent":"left"},"style":{"spacing":{"blockGap":"0.75rem"}}} -->
		<div class="wp-block-group">
			<!-- wp:paragraph {"className":"lumo-eyebrow"} -->
			<p class="lumo-eyebrow">Brew guides</p>
			<!-- /wp:paragraph -->
			<!-- wp:heading -->
			<h2 class="wp-block-heading">Better coffee at home, step by step</h2>
			<!-- /wp:heading -->
		</div>
		<!-- /wp:group -->
		<!-- wp:paragraph -->
		<p><a href="/brew-guides/">All guides →</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
	<!-- wp:query {"queryId":12,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"className":"lumo-reveal-group","layout":{"type":"grid","columnCount":3,"minimumColumnWidth":"17rem"},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
			<!-- wp:group {"className":"lumo-linked-card","style":{"spacing":{"blockGap":"0.75rem"}},"layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group lumo-linked-card">
				<!-- wp:post-featured-image {"aspectRatio":"3/2","className":"lumo-zoom","style":{"border":{"radius":"18px"},"spacing":{"margin":{"bottom":"0.5rem"}}}} /-->
				<!-- wp:post-terms {"term":"post_tag","className":"lumo-eyebrow","separator":" · "} /-->
				<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"x-large"} /-->
				<!-- wp:post-excerpt {"excerptLength":22,"textColor":"muted","fontSize":"small"} /-->
			</div>
			<!-- /wp:group -->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</div>
<!-- /wp:group -->
