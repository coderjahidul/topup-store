<?php

namespace App\Http\Controllers\Admin\Concerns;

trait TransformsTranslatable
{
    /**
     * @param  array<string, mixed>  $data
     * @param  list<string>  $fields
     * @return array<string, mixed>
     */
    protected function mapTranslations(array $data, array $fields): array
    {
        foreach ($fields as $field) {
            $bn = $data["{$field}_bn"] ?? null;
            $en = $data["{$field}_en"] ?? null;
            unset($data["{$field}_bn"], $data["{$field}_en"]);

            if ($bn !== null || $en !== null) {
                $data[$field] = [
                    'bn' => $bn ?? '',
                    'en' => $en ?? '',
                ];
            }
        }

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    protected function flattenTranslations(object $model, array $fields): array
    {
        $payload = [];

        foreach ($fields as $field) {
            $payload["{$field}_bn"] = $model->getTranslation($field, 'bn', false);
            $payload["{$field}_en"] = $model->getTranslation($field, 'en', false);
        }

        return $payload;
    }
}
