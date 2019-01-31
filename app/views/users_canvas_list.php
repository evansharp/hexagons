<?php $timeAgo = new Westsworld\TimeAgo(); ?>

<div class="container">
    <div class="row">
        <h2> Saved Haxagon Formations </h2>
    </div>
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
                        <td><a href="<?php echo base_url() . 'formation/'. $canvas['canvas_id'];?>">
                            <?php echo $canvas['title'];?>
                        </a></td>
                        <td><?php echo $timeAgo->inWordsFromStrings( $canvas['modified'] );?></td>
                        <td><?php echo $timeAgo->inWordsFromStrings( $canvas['created'] );?></td>
                        <td><a href="" class="delete_from_list_button" data-canvas-id="<?php echo $canvas['canvas_id'];?>">
                            <i class="material-icons">delete</i>
                        </a></td>
                    </tr>
                <?php endforeach;?>
            </tbody>
          </table>
        </div>

    </div>
</div>
