package scopify.work.backend.model

import kotlin.random.Random

enum class ScopeState {
    Proposed,
    InProgress,
    Complete
}

data class ScopeScore(
    val name: String,
    val value: Int,
    val comment: String?
)

// A scoping session to be defined
data class ScopeSession(
    val id: String,
    val title: String,
    val description: String,
    val group: String?,
    val scores: List<ScopeScore> = listOf(),
    val averageScore: Double = 0.0,
    var state: ScopeState = ScopeState.Proposed
)

data class ScopeGroup(
    val id: String,
    val title: String
)

interface IScopeRepository {
    fun createGroup(id: String, title: String): ScopeGroup?
    fun getGroupScopes(id: String): List<String>
    fun getGroup(id: String): ScopeGroup?
    fun getSession(id: String): ScopeSession?
    fun writeSession(session: ScopeSession)
}

private val charPool: List<Char> = ('a'..'z') + ('A'..'Z')

fun generateId(len: Int = 5): String = (0..len)
    .map { Random.nextInt(0, charPool.size) }
    .map(charPool::get)
    .joinToString("")
