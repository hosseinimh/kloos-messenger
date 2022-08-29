<?php

namespace App\Http\Requests\Position;

use App\Constants\ErrorCode;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class IndexPositionRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $response = new Response(['_result' => '0', '_error' => $validator->errors()->first(), '_errorCode' => ErrorCode::FORM_INPUT_INVALID], 200);

        throw new ValidationException($validator, $response);
    }

    public function rules()
    {
        return [
            'parent_id' => 'required|numeric|gt:0',
        ];
    }

    public function messages()
    {
        return [
            'parent_id.required' => __('position.parent_id_required'),
            'parent_id.numeric' => __('position.parent_id_numeric'),
            'parent_id.gt' => __('position.parent_id_gt'),
        ];
    }
}
