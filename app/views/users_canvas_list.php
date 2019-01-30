<?php $timeAgo = new Westsworld\TimeAgo(); ?>

<div class="container">
    <div class="row">
        <h2> Saved Haxagon Formations </h2>
    </div>
    <?php var_dump($canvas_list);?>
    <div class="row">
        <div class="col s12">
            <table class="striped">
            <thead>
              <tr>
                  <th>Title</th>
                  <th>Last Modified</th>
                  <th>Created</th>
                  <th>Actions</th>
              </tr>
            </thead>

            <tbody>
                <?php foreach($canvas_list as $canvas): ?>
                    <tr>
                        <td><?php echo $canvas['title'];?></td>
                        <td><?php echo $timeAgo->inWordsFromStrings( $canvas['modified'] );?></td>
                        <td><?php echo $timeAgo->inWordsFromStrings( $canvas['created'] );?></td>
                        <td></td>
                    </tr>
                <?php endforeach;?>
            </tbody>
          </table>
        </div>

    </div>
</div>
