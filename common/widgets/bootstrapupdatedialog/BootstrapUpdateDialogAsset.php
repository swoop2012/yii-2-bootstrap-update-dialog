<?php
namespace common\widgets\bootstrapupdatedialog;

use yii\web\AssetBundle;

class BootstrapUpdateDialogAsset extends AssetBundle
{
    public $sourcePath = '@common/widgets/bootstrapupdatedialog/assets/';

    public $js = [
        'BootstrapUpdateDialog.js',
    ];

    public $depends = [
        'yii\web\JqueryAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
} 