<form action="/home?destination=node/54" method="post" id="user-login-form" accept-charset="UTF-8" name="user-login-form">
    <div>
        <div class="control-group form-type-textfield form-item-name">
            <div class="controls">
                <input type="text" id="edit-name" name="name" value="" size="15" maxlength="60" class="form-text required" placeholder="Username" />
            </div>
        </div>
        <div class="control-group form-type-password form-item-pass">
            <div class="controls">
                <input type="password" id="edit-pass" name="pass" size="15" maxlength="128" class="form-text required" placeholder="Password" />
            </div>
        </div>
        <input type="hidden" name="form_build_id" value="<?php print $elements['form_build_id']['#value']; ?>" /> 
        <input type="hidden" name="form_id" value="user_login_block" /> 
        <input class="btn form-submit" type="submit" id="edit-submit" name="op" value="Sign in" />
    </div>
</form>
