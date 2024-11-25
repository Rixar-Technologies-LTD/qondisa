<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetGroup extends Model
{
    protected $fillable = [
        'project_id',
        'author_id',
        'name'
    ];
}
