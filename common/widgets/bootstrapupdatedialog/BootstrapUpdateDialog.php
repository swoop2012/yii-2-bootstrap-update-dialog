<?php
/**
 * BootstrapUpdateDialog allows to create/update model entry from Bootstrap Modal dialog.
 *
 * @author Vladimir Lysenko <svoop@bk.ru>
 */
namespace common\widgets\bootstrapupdatedialog;

use yii\web\View;
use yii\base\Widget;
use yii\web\ViewAction;

class BootstrapUpdateDialog extends Widget
{

    public $showBottomSubmitButton = true;
    public $showBottomCancelButton = true;
    public $partial = 'modal';
    /**
     * @var id of the dialog.
     */
    public $idDialog = 'update-dialog';
    /**
     * @var options for the update dialog plugin.
     */
    public $updateOptions = array(
        'createLinks' => 'a.update-dialog-create',
        'updateLinks' => 'div.grid-view a.update',
        'gridSelector' => 'div.grid-view',
        'dialogContent' => 'div.modal-body'

    );
    /**
     * @var string the title of the dialog.
     */

    /**
     * Add the update dialog to current page.
     */
    public function run()
    {
        // Publish extension assets
        $view = $this->getView();
        BootstrapUpdateDialogAsset::register($view);

        // Add cookie script and csrf cookie if using CSRF validation.
        $view->registerJs("$('#" . $this->idDialog . "').updateDialogBootstrapExt(" . \yii\helpers\Json::encode($this->updateOptions) . ");");
        return $this->render($this->partial);
    }
}

?>