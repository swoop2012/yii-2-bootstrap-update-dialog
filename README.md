# yii-2-bootstrap-update-dialog
*   To use this widget you should put the folder bootstrapupdatedialog in your directory with widgets. In my case it's common/widgets . If your widget directory differs - you should change namespaces in php files according to your widget directory path.
*   In your view you should call render widget like that:
</pre>
<pre>
<code>
\common\widgets\bootstrapupdatedialog\BootstrapUpdateDialog::widget([
  'view'=>$this,
  'updateOptions'=>[
    'updateLinks'=>'.translate',
    'updateTitle'=>'Translate',
    'gridSelector'=>'#projects'
  ]
]);
</code>
</pre>
Again, correct namespace if needed.
This is basic configuration.
Widget parameters:
*  updateOptions - array of the options with next elements:
      1.  createLinks - selector for links to open create modal,
      2.  updateLinks - selector for links to open update  modal,
      3.  gridSelector - selector of the grid, that should be updated,
      4.  dialogContent - selector of the container where content for dialog will be loaded,
      5.  updateDialogWithCallback - function that should replace default function(prepare params for ajax request and sends it),
      6.  updateDialogActionBase - function that should replace default function(called when click on element with createLinks selector and updateLinks selector),
      7.  getFormData - function that should replace default function(used to get data from form),
      8.  createTitle - title for create modal,
      9.  updateTitle - title for update modal,
      10.  validate - js validation function if needed(should return true if everything is ok and false otherwise)
      11.  ajaxOptions - 
           *   type - type of request(default 'post'),
           *   dataType - data type(default 'json'),
           *   cache - default false
      12. hideDelay - time in milliseconds before autoclose of the dialog when form is successfully saved (default 500)
*  idDialog - you could specify id of the dialog (in case if there is going to be more than one dialog in one page)

Your controller action will look like this:
<pre>
<code>
public function actionCreate() {
  $model = new ProjectImage();
  if ($model->load(Yii::$app->request->post()) && $model->save()) {
    echo Json::encode([
      'status'=>'success',
      'content'=>\Yii::t('site','SUCCESS_CREATED'),
    ]);
  } else {
    echo Json::encode([
      'status'=>'failure',
      'content'=>$this->renderPartial('_form', ['model' => $model,]),
    ]);
  }
  \Yii::$app->end(200);
}
</code>
</pre>
